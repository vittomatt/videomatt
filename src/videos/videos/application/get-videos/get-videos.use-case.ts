import { VideoRead } from '@videos/videos/domain/models/read/video.read';
import { GetVideosRepository } from '@videos/videos/domain/repositories/get-videos.repository';
import { VIDEO_TOKEN } from '@videos/videos/infrastructure/di/tokens-video';

import { inject, injectable } from 'tsyringe';

@injectable()
export class GetVideosUseCase {
    constructor(
        @inject(VIDEO_TOKEN.GET_VIDEOS_REPOSITORY) private readonly repository: GetVideosRepository<VideoRead[]>
    ) {}

    async execute(userId: string): Promise<VideoRead[]> {
        return this.repository.raw(userId);
    }
}
