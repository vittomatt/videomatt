import { inject, injectable } from 'tsyringe';

import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { EventBus } from '@videomatt/shared/domain/event-bus/event-bus';
import { VideoRepository } from '@videomatt/videos/domain/repositories/video.repository';
import { Video } from '@videomatt/videos/domain/models/video';

@injectable()
export class CreateVideoUseCase {
    constructor(
        @inject(TOKEN.VIDEO.REPOSITORY) private readonly videoRepository: VideoRepository<Video>,
        @inject(TOKEN.SHARED.EVENT_BUS) private readonly eventBus: EventBus
    ) {}

    async execute(videoId: string, videoTitle: string, videoDescription: string, videoUrl: string) {
        const video = Video.create(videoId, videoTitle, videoDescription, videoUrl);
        this.videoRepository.add(video);
        this.eventBus.publish(video.pullDomainEvents());
    }
}
