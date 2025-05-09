import { DomainEventBus } from '@shared/domain/event-bus/domain-event-bus';
import { ExtractPrimitives } from '@shared/domain/models/extract-primitives';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { VideoComment } from '@videos/video-comment/domain/models/video-comment';
import { VideoCommentRepository } from '@videos/video-comment/infrastructure/repositories/video-comment.repository';
import { VideoNotFoundError } from '@videos/videos/domain/errors/video-not-found.error';
import { Video } from '@videos/videos/domain/models/video';
import { VideoRepository } from '@videos/videos/domain/repositories/video.repository';
import { VIDEO_TOKEN } from '@videos/videos/infrastructure/di/video.tokens';

import { inject, injectable } from 'tsyringe';

type AddCommentToVideoUseCaseInput = {
    id: string;
    text: string;
    videoId: string;
    userId: string;
};

@injectable()
export class AddCommentToVideoUseCase {
    constructor(
        @inject(VIDEO_TOKEN.REPOSITORY) private readonly repository: VideoRepository<Video>,
        @inject(VIDEO_TOKEN.VIDEO_COMMENT_REPOSITORY)
        private readonly videoCommentRepository: VideoCommentRepository<VideoComment>,
        @inject(TOKEN.DEFERRED_DOMAIN_EVENT_BUS) private readonly eventBus: DomainEventBus
    ) {}

    async execute({ id, text, videoId, userId }: AddCommentToVideoUseCaseInput): Promise<void> {
        const commentExists = await this.videoCommentRepository.searchById(id);
        if (commentExists.isOk() && commentExists.value) {
            return;
        }

        const videoRead = await this.repository.searchById(videoId);
        if (videoRead.isErr() || !videoRead.value) {
            throw new VideoNotFoundError();
        }

        const newComment = VideoComment.create({ id, text, userId, videoId });
        const newCommentRead = await this.videoCommentRepository.add(newComment);
        if (newCommentRead.isErr()) {
            throw newCommentRead.error;
        }

        const video = Video.fromPrimitives(videoRead.value as ExtractPrimitives<Video>);
        video.addComment(newComment);

        await this.eventBus.publish(video.pullDomainEvents());
    }
}
