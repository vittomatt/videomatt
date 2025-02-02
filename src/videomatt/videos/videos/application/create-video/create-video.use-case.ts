import { VideoRepository } from '@videomatt/videos/videos/domain/repositories/video.repository';
import { VIDEO_TOKEN } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { DomainEventBus } from '@videomatt/shared/domain/event-bus/domain-event-bus';
import { Video } from '@videomatt/videos/videos/domain/models/write/video';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
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
    }) {
        const video = Video.create({
            id,
            title,
            description,
            url,
            userId,
        });
        this.repository.add(video);
        this.eventBus.publish(video.pullDomainEvents());
    }
}
