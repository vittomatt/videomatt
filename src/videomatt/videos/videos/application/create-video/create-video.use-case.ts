import { VideoAlreadyExistsError } from '@videomatt/videos/videos/domain/errors/video-already-exists.error';
import { VideoRepository } from '@videomatt/videos/videos/domain/repositories/video.repository';
import { FilterOperator, Filters } from '@videomatt/shared/domain/repositories/filters';
import { VIDEO_TOKEN } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { DomainEventBus } from '@videomatt/shared/domain/event-bus/domain-event-bus';
import { Video } from '@videomatt/videos/videos/domain/models/write/video';
import { Criteria } from '@videomatt/shared/domain/repositories/criteria';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { Either, right, left } from 'fp-ts/lib/Either';
import { inject, injectable } from 'tsyringe';
import { fold } from 'fp-ts/lib/Option';

@injectable()
export class CreateVideoUseCase {
    constructor(
        @inject(VIDEO_TOKEN.REPOSITORY) private readonly repository: VideoRepository<Video>,
        @inject(TOKEN.DOMAIN_EVENT_BUS) private readonly eventBus: DomainEventBus
    ) {}

    async execute({
        id,
        title,
        description,
        url,
        userId,
    }: {
        id: string;
        title: string;
        description: string;
        url: string;
        userId: string;
    }): Promise<Either<VideoAlreadyExistsError, void>> {
        const criteria = Criteria.create().addFilter(Filters.create('id', FilterOperator.EQUALS, id));
        const video = await this.repository.searchById(criteria);

        return fold<Video, Promise<Either<VideoAlreadyExistsError, void>>>(
            async () => {
                const newVideo = Video.create({
                    id,
                    title,
                    description,
                    url,
                    userId,
                });
                await this.repository.add(newVideo);
                await this.eventBus.publish(newVideo.pullDomainEvents());
                return right(undefined);
            },
            async (existingVideo) => left(new VideoAlreadyExistsError())
        )(video);
    }
}
