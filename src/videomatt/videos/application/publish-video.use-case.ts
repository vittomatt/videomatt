import { inject, injectable } from 'tsyringe';

import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { EventBus } from '@videomatt/shared/domain/event-bus/event-bus';
import { VideoRepository } from '@videomatt/videos/domain/repositories/video.repository';
import { Video } from '@videomatt/videos/domain/models/video';

@injectable()
export class PublishVideoUseCase {
    constructor(
        @inject(TOKEN.VIDEO.REPOSITORY) private readonly repository: VideoRepository<Video>,
        @inject(TOKEN.SHARED.EVENT_BUS) private readonly eventBus: EventBus
    ) {}

    async execute(videoId: string, videoTitle: string, videoDescription: string, videoUrl: string, userId: string) {
        const video = Video.create(videoId, videoTitle, videoDescription, videoUrl, userId);
        this.repository.add(video);
        this.eventBus.publish(video.pullDomainEvents());
    }
}
