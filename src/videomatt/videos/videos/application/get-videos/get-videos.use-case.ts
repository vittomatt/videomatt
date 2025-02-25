import { GetVideosRepository } from '@videomatt/videos/videos/domain/repositories/get-videos.repository';
import { VIDEO_TOKEN } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { VideoRead } from '@videomatt/videos/videos/domain/models/read/video.read';
import { DomainError } from '@videomatt/shared/domain/errors/domain.error';
import { Either, right } from 'fp-ts/lib/Either';
import { inject, injectable } from 'tsyringe';
import { fold } from 'fp-ts/lib/Option';

@injectable()
export class GetVideosUseCase {
    constructor(
        @inject(VIDEO_TOKEN.GET_VIDEOS_REPOSITORY) private readonly repository: GetVideosRepository<VideoRead[]>
    ) {}

    async execute(userId: string): Promise<Either<DomainError, VideoRead[]>> {
        const videos = await this.repository.raw(userId);
        return fold<VideoRead[], Either<DomainError, VideoRead[]>>(
            () => right([]),
            (videos) => right(videos)
        )(videos);
    }
}
