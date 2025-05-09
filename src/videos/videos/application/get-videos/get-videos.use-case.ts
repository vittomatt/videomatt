import { ExtractPrimitives } from '@shared/domain/models/extract-primitives';
import { VideoNotFoundError } from '@videos/videos/domain/errors/video-not-found.error';
import { VideoWithAmountOfComments } from '@videos/videos/domain/models/video-with-amount-of-comments';
import { GetVideosRepository } from '@videos/videos/domain/repositories/get-videos.repository';
import { VIDEO_TOKEN } from '@videos/videos/infrastructure/di/video.tokens';

import { inject, injectable } from 'tsyringe';

type GetVideosUseCaseInput = {
    userId: string;
};

@injectable()
export class GetVideosUseCase {
    constructor(
        @inject(VIDEO_TOKEN.GET_VIDEOS_REPOSITORY)
        private readonly repository: GetVideosRepository<VideoWithAmountOfComments[]>
    ) {}

    async execute({ userId }: GetVideosUseCaseInput): Promise<ExtractPrimitives<VideoWithAmountOfComments>[]> {
        const videosWithAmountOfCommentsRead = await this.repository.raw(userId);
        if (videosWithAmountOfCommentsRead.isErr()) {
            throw videosWithAmountOfCommentsRead.error;
        }

        const videosWithAmountOfComments =
            videosWithAmountOfCommentsRead.value as ExtractPrimitives<VideoWithAmountOfComments>[];
        if (videosWithAmountOfComments.length === 0) {
            throw new VideoNotFoundError();
        }

        return videosWithAmountOfComments;
    }
}
