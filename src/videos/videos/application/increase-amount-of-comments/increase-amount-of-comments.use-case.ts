import { ExtractPrimitives } from '@shared/domain/models/extract-primitives';
import { VideoNotFoundError } from '@videos/videos/domain/errors/video-not-found.error';
import { VideoWithAmountOfComments } from '@videos/videos/domain/models/video-with-amount-of-comments';
import { VideoWithAmountOfCommentsRepository } from '@videos/videos/domain/repositories/video-with-amount-of-comments.repository';
import { VIDEO_TOKEN } from '@videos/videos/infrastructure/di/video.tokens';

import { inject, injectable } from 'tsyringe';

type IncreaseAmountOfCommentsUseCaseInput = {
    videoId: string;
    commentId: string;
};

@injectable()
export class IncreaseAmountOfCommentsUseCase {
    constructor(
        @inject(VIDEO_TOKEN.VIDEO_WITH_AMOUNT_OF_COMMENTS_REPOSITORY)
        private readonly repository: VideoWithAmountOfCommentsRepository<VideoWithAmountOfComments>
    ) {}

    async execute({ videoId, commentId }: IncreaseAmountOfCommentsUseCaseInput): Promise<void> {
        const commentExists = await this.repository.searchById(commentId);
        if (commentExists.isOk() && commentExists.value) {
            return;
        }

        const videoWithAmountOfCommentsRead = await this.repository.searchById(videoId);
        if (videoWithAmountOfCommentsRead.isErr() || !videoWithAmountOfCommentsRead.value) {
            throw new VideoNotFoundError();
        }

        const videoWithAmountOfComments = VideoWithAmountOfComments.fromPrimitives(
            videoWithAmountOfCommentsRead.value as ExtractPrimitives<VideoWithAmountOfComments>
        );

        videoWithAmountOfComments.increaseAmountOfComments();
        const result = await this.repository.update(videoWithAmountOfComments);
        if (result.isErr()) {
            throw result.error;
        }
    }
}
