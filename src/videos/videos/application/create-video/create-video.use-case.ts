import { DomainEventBus } from '@shared/domain/event-bus/domain-event-bus';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { VideoAlreadyExistsError } from '@videos/videos/domain/errors/video-already-exists.error';
import { Video } from '@videos/videos/domain/models/write/video';
import { VideoRepository } from '@videos/videos/domain/repositories/video.repository';
import { VIDEO_TOKEN } from '@videos/videos/infrastructure/di/tokens-video';

import { inject, injectable } from 'tsyringe';

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
    }): Promise<VideoAlreadyExistsError | void> {
        const video = await this.repository.searchById(id);
        if (video) {
            return new VideoAlreadyExistsError();
        }

        const newVideo = Video.create({
            id,
            title,
            description,
            url,
            userId,
        });
        await this.repository.add(newVideo);
        await this.eventBus.publish(newVideo.pullDomainEvents());
    }
}
