import { GetVideosRepository } from '@videomatt/videos/videos/domain/repositories/get-videos.repository';
import { VIDEO_TOKENS } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { VideoRead } from '@videomatt/videos/videos/domain/models/read/video.read';
import { inject, injectable } from 'tsyringe';

@injectable()
export class GetVideosUseCase {
    constructor(
        @inject(VIDEO_TOKENS.GET_VIDEOS_REPOSITORY) private readonly repository: GetVideosRepository<VideoRead[]>
    ) {}

    async execute(): Promise<VideoRead[]> {
        const videos = await this.repository.raw();
        return videos;
    }
}
