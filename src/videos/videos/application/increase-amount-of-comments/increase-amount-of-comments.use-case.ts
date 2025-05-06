import { VideoNotFoundError } from '@videos/videos/domain/errors/video-not-found.error';
import { VideoRead } from '@videos/videos/domain/models/read/video.read';
import { VideoReadRepository } from '@videos/videos/domain/repositories/video-read.repository';
import { VIDEO_TOKEN } from '@videos/videos/infrastructure/di/video.tokens';

import { inject, injectable } from 'tsyringe';

@injectable()
export class IncreaseAmountOfCommentsUseCase {
    constructor(
        @inject(VIDEO_TOKEN.VIDEO_READ_REPOSITORY) private readonly repository: VideoReadRepository<VideoRead>
    ) {}

    async execute(videoId: string, commentId: string) {
        const commentExists = await this.repository.searchById(commentId);
        if (commentExists) {
            return;
        }

        const video = await this.repository.searchById(videoId);
        if (!video) {
            throw new VideoNotFoundError();
        }

        video.increaseAmountOfComments();
        await this.repository.update(video);
    }
}
