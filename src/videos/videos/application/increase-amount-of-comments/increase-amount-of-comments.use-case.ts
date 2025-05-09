import { ExtractPrimitives } from '@shared/domain/models/extract-primitives';
import { VideoNotFoundError } from '@videos/videos/domain/errors/video-not-found.error';
import { VideoProjection } from '@videos/videos/domain/models/video-projection';
import { VideoProjectionRepository } from '@videos/videos/domain/repositories/video-projection.repository';
import { VIDEO_TOKEN } from '@videos/videos/infrastructure/di/video.tokens';

import { inject, injectable } from 'tsyringe';

type IncreaseAmountOfCommentsUseCaseInput = {
    videoId: string;
    commentId: string;
};

@injectable()
export class IncreaseAmountOfCommentsUseCase {
    constructor(
        @inject(VIDEO_TOKEN.VIDEO_PROJECTION_REPOSITORY)
        private readonly repository: VideoProjectionRepository<VideoProjection>
    ) {}

    async execute({ videoId, commentId }: IncreaseAmountOfCommentsUseCaseInput): Promise<void> {
        const commentExists = await this.repository.searchById(commentId);
        if (commentExists.isOk() && commentExists.value) {
            return;
        }

        const VideoProjectionRead = await this.repository.searchById(videoId);
        if (VideoProjectionRead.isErr() || !VideoProjectionRead.value) {
            throw new VideoNotFoundError();
        }

        const videoProjection = VideoProjection.fromPrimitives(
            VideoProjectionRead.value as ExtractPrimitives<VideoProjection>
        );

        videoProjection.increaseAmountOfComments();
        const result = await this.repository.update(videoProjection);
        if (result.isErr()) {
            throw result.error;
        }
    }
}
