import { GetVideosRepository } from '@videomatt/videos/videos/domain/repositories/get-videos.repository';
import { TOKEN as TOKEN_VIDEO } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { VideoRead } from '@videomatt/videos/videos/domain/models/read/video.read';
import { inject, injectable } from 'tsyringe';

@injectable()
export class GetVideosUseCase {
    constructor(
        @inject(TOKEN_VIDEO.GET_VIDEOS_REPOSITORY) private readonly repository: GetVideosRepository<VideoRead[]>
    ) {}

    async execute(): Promise<VideoRead[]> {
        const videos = await this.repository.raw();
        return videos;
    }
}
