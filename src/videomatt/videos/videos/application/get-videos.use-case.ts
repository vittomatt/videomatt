import { VideoRepository } from '@videomatt/videos/videos/domain/repositories/video.repository';
import { Criteria } from '@videomatt/shared/domain/repositories/criteria';
import { EventBus } from '@videomatt/shared/domain/event-bus/event-bus';
import { Video } from '@videomatt/videos/videos/domain/models/video';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { inject, injectable } from 'tsyringe';

@injectable()
export class GetVideosUseCase {
    constructor(
        @inject(TOKEN.VIDEO.REPOSITORY) private readonly repository: VideoRepository<Video>,
        @inject(TOKEN.SHARED.EVENT_BUS) private readonly eventBus: EventBus
    ) {}

    async execute(): Promise<Video[]> {
        const criteria = Criteria.create();
        const videos = await this.repository.search(criteria);
        return videos;
    }
}
