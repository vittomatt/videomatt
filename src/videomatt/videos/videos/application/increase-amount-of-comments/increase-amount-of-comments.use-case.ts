import { inject, injectable } from 'tsyringe';

import { VideoReadRepository } from '@videomatt/videos/videos/domain/repositories/video-read.repository';
import { VIDEO_TOKEN } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { VideoRead } from '@videomatt/videos/videos/domain/models/read/video.read';

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
            throw new Error('Video not found');
        }

        video.increaseAmountOfComments();
        await this.repository.update(video);
    }
}
