import { inject, injectable } from 'tsyringe';

import { DomainEventBus } from '@videomatt/shared/domain/event-bus/domain-event-bus';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { VideoComment } from '@videomatt/videos/video-comment/domain/models/write/video-comment';
import { VideoNotFoundError } from '@videomatt/videos/videos/domain/errors/video-not-found.error';
import { Video } from '@videomatt/videos/videos/domain/models/write/video';
import { VideoRepository } from '@videomatt/videos/videos/domain/repositories/video.repository';
import { VIDEO_TOKEN } from '@videomatt/videos/videos/infrastructure/di/tokens-video';

@injectable()
export class AddCommentToVideoUseCase {
    constructor(
        @inject(VIDEO_TOKEN.REPOSITORY) private readonly repository: VideoRepository<Video>,
        @inject(TOKEN.DOMAIN_EVENT_BUS) private readonly eventBus: DomainEventBus
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
        const commentExists = await this.repository.searchById(id);
        if (commentExists) {
            return;
        }

        const video = await this.repository.searchById(videoId);
        if (!video) {
            return new VideoNotFoundError();
        }

        const newComment = VideoComment.create({ id, text, userId, videoId });
        video.addComment(newComment);

        await this.repository.update(video);
        await this.eventBus.publish(video.pullDomainEvents());
    }
}
