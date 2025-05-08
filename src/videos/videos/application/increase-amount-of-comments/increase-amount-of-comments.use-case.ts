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
        if (commentExists.isOk() && commentExists.value) {
            return;
        }

        const video = await this.repository.searchById(videoId);
        if (video.isErr() || !video.value) {
            throw new VideoNotFoundError();
        }

        video.value.increaseAmountOfComments();
        const result = await this.repository.update(video.value);
        if (result.isErr()) {
            throw result.error;
        }
    }
}
