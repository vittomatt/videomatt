import { VideoComment } from '@videomatt/videos/video-comment/domain/models/write/video-comment';
import { VideoRepository } from '@videomatt/videos/videos/domain/repositories/video.repository';
import { FilterOperator, Filters } from '@videomatt/shared/domain/repositories/filters';
import { VIDEO_TOKENS } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { Video } from '@videomatt/videos/videos/domain/models/write/video';
import { Criteria } from '@videomatt/shared/domain/repositories/criteria';
import { EventBus } from '@videomatt/shared/domain/event-bus/event-bus';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { inject, injectable } from 'tsyringe';

@injectable()
export class AddCommentToVideoUseCase {
    constructor(
        @inject(VIDEO_TOKENS.REPOSITORY) private readonly repository: VideoRepository<Video>,
        @inject(TOKEN.EVENT_BUS) private readonly eventBus: EventBus
    ) {}

    async execute({ id, text, videoId, userId }: { id: string; text: string; videoId: string; userId: string }) {
        const criteria = Criteria.create().addFilter(Filters.create('id', FilterOperator.EQUALS, videoId));
        const videos = await this.repository.search(criteria);
        if (!videos.length) {
            throw new Error('Video not found');
        }

        const video = videos[0];

        const comment = VideoComment.create({ id, text, userId, videoId });
        video.addComment(comment);

        this.repository.update(video);
        this.eventBus.publish(video.pullDomainEvents());
    }
}
