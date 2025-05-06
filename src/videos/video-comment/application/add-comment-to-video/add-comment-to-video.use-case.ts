import { DomainEventBus } from '@shared/domain/event-bus/domain-event-bus';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { VideoComment } from '@videos/video-comment/domain/models/write/video-comment';
import { VideoCommentRepository } from '@videos/video-comment/infrastructure/repositories/video-comment.repository';
import { VideoNotFoundError } from '@videos/videos/domain/errors/video-not-found.error';
import { Video } from '@videos/videos/domain/models/write/video';
import { VideoRepository } from '@videos/videos/domain/repositories/video.repository';
import { VIDEO_TOKEN } from '@videos/videos/infrastructure/di/video.tokens';

import { inject, injectable } from 'tsyringe';

@injectable()
export class AddCommentToVideoUseCase {
    constructor(
        @inject(VIDEO_TOKEN.REPOSITORY) private readonly repository: VideoRepository<Video>,
        @inject(VIDEO_TOKEN.VIDEO_COMMENT_REPOSITORY)
        private readonly videoCommentRepository: VideoCommentRepository<VideoComment>,
        @inject(TOKEN.DEFERRED_DOMAIN_EVENT_BUS) private readonly eventBus: DomainEventBus
    ) {}

    async execute({
        id,
        text,
        videoId,
        userId,
    }: {
        id: string;
        text: string;
        videoId: string;
        userId: string;
    }): Promise<VideoNotFoundError | void> {
        const commentExists = await this.videoCommentRepository.searchById(id);
        if (commentExists) {
            return;
        }

        const video = await this.repository.searchById(videoId);
        if (!video) {
            return new VideoNotFoundError();
        }

        const newComment = VideoComment.create({ id, text, userId, videoId });
        await this.videoCommentRepository.add(newComment);
        video.addComment(newComment);

        await this.eventBus.publish(video.pullDomainEvents());
    }
}
