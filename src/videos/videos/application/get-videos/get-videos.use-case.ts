import { VideoNotFoundError } from '@videos/videos/domain/errors/video-not-found.error';
import { VideoRead } from '@videos/videos/domain/models/read/video.read';
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
        private readonly repository: GetVideosRepository<VideoRead[]>
    ) {}

    // FITU return DTO or read model
    async execute({ userId }: GetVideosUseCaseInput): Promise<VideoRead[]> {
        const videos = await this.repository.raw(userId);
        if (videos.isErr()) {
            throw videos.error;
        }

        if (videos.value.length === 0) {
            throw new VideoNotFoundError();
        }

        return videos.value;
    }
}
