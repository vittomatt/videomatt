import { VideoRepository } from '@videomatt/videos/domain/repositories/video-repository';
import { Video } from '@videomatt/videos/domain/models/video';

export class CreateVideo {
    constructor(private videoRepository: VideoRepository<Video>) {}

    async execute(videoId: string, videoTitle: string, videoDescription: string, videoUrl: string) {}
}
