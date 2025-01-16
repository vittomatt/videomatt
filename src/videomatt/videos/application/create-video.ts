import { inject, injectable } from 'tsyringe';

import { VideoRepository } from '@videomatt/videos/domain/repositories/video-repository';
import { Video } from '@videomatt/videos/domain/models/video';
import { VideoId } from '@videomatt/videos/domain/models/video-id';
import { VideoTitle } from '@videomatt/videos/domain/models/video-title';
import { VideoDescription } from '@videomatt/videos/domain/models/video-description';
import { VideoURL } from '@videomatt/videos/domain/models/video-url';
import { TOKEN } from '@videomatt/shared/di/tokens';

@injectable()
export class CreateVideo {
    constructor(@inject(TOKEN.VIDEO_REPOSITORY) private videoRepository: VideoRepository<Video>) {}

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
