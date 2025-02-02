import { VideoReadRepository } from '@videomatt/videos/videos/domain/repositories/video-read.repository';
import { VIDEO_TOKEN } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { VideoRead } from '@videomatt/videos/videos/domain/models/read/video.read';
import { inject, injectable } from 'tsyringe';

@injectable()
export class CreateVideoReadUseCase {
    constructor(
        @inject(VIDEO_TOKEN.VIDEO_READ_REPOSITORY) private readonly repository: VideoReadRepository<VideoRead>
    ) {}

    async execute({
        id,
        title,
        description,
        url,
        userId,
    }: {
        id: string;
        title: string;
        description: string;
        url: string;
        userId: string;
    }) {
        const videoRead = VideoRead.create({ id, title, description, url, userId });
        await this.repository.add(videoRead);
    }
}
