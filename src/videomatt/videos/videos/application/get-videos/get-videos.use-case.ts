import { GetVideosRepository } from '@videomatt/videos/videos/domain/repositories/get-videos.repository';
import { VIDEO_TOKEN } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { VideoRead } from '@videomatt/videos/videos/domain/models/read/video.read';
import { DomainError } from '@videomatt/shared/domain/errors/domain.error';
import { inject, injectable } from 'tsyringe';
import * as Effect from 'effect/Effect';
import * as Option from 'effect/Option';
import { pipe } from 'effect';

@injectable()
export class GetVideosUseCase {
    constructor(
        @inject(VIDEO_TOKEN.GET_VIDEOS_REPOSITORY) private readonly repository: GetVideosRepository<VideoRead[]>
    ) {}

    async execute(userId: string): Promise<Effect.Effect<VideoRead[], DomainError>> {
        return pipe(
            await this.repository.raw(userId),
            Option.match({
                onNone: () => Effect.succeed([] as VideoRead[]),
                onSome: (videos: VideoRead[]) => Effect.succeed(videos),
            })
        );
    }
}
