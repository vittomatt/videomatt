import { ExtractPrimitives } from '@shared/domain/models/extract-primitives';
import { VideoNotFoundError } from '@videos/videos/domain/errors/video-not-found.error';
import { VideoProjection } from '@videos/videos/domain/models/video-projection';
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
        private readonly repository: GetVideosRepository<VideoProjection[]>
    ) {}

    async execute({ userId }: GetVideosUseCaseInput): Promise<ExtractPrimitives<VideoProjection>[]> {
        const videosProjectionReads = await this.repository.raw(userId);
        if (videosProjectionReads.isErr()) {
            throw videosProjectionReads.error;
        }

        const videosProjections = videosProjectionReads.value as ExtractPrimitives<VideoProjection>[];
        if (videosProjections.length === 0) {
            throw new VideoNotFoundError();
        }

        return videosProjections;
    }
}
