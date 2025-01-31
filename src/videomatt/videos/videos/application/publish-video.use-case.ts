import { VideoRepository } from '@videomatt/videos/videos/domain/repositories/video.repository';
import { TOKEN as TOKEN_VIDEO } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { EventBus } from '@videomatt/shared/domain/event-bus/event-bus';
import { Video } from '@videomatt/videos/videos/domain/models/video';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { inject, injectable } from 'tsyringe';

@injectable()
export class PublishVideoUseCase {
    constructor(
        @inject(TOKEN_VIDEO.REPOSITORY) private readonly repository: VideoRepository<Video>,
        @inject(TOKEN.EVENT_BUS) private readonly eventBus: EventBus
    ) {}

    async execute(id: string, title: string, description: string, url: string, userId: string) {
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
