import { VideoRepository } from '@videomatt/videos/domain/repositories/video-repository';
import { Video } from '@videomatt/videos/domain/models/video';
import { VideoId } from '@videomatt/videos/domain/models/video-id';
import { VideoTitle } from '@videomatt/videos/domain/models/video-title';
import { VideoDescription } from '@videomatt/videos/domain/models/video-description';
import { VideoURL } from '@videomatt/videos/domain/models/video-url';

export class CreateVideo {
    constructor(private videoRepository: VideoRepository<Video>) {}

    async execute(videoId: string, videoTitle: string, videoDescription: string, videoUrl: string) {
        this.videoRepository.add(
            new Video(
                new VideoId(videoId),
                new VideoTitle(videoTitle),
                new VideoDescription(videoDescription),
                new VideoURL(videoUrl)
            )
        );
    }
}
