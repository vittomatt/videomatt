import { UnexpectedError } from '@shared/domain/errors/unexpected.error';
import { VideoNotFoundError } from '@videos/videos/domain/errors/video-not-found.error';
import { VideoRead } from '@videos/videos/domain/models/read/video.read';
import { GetVideosRepository } from '@videos/videos/domain/repositories/get-videos.repository';
import { VIDEO_TOKEN } from '@videos/videos/infrastructure/di/tokens-video';

import { ResultAsync, errAsync, fromPromise, okAsync } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

@injectable()
export class GetVideosUseCase {
    constructor(
        @inject(VIDEO_TOKEN.GET_VIDEOS_REPOSITORY) private readonly repository: GetVideosRepository<VideoRead[]>
    ) {}

    execute(userId: string): ResultAsync<VideoRead[], VideoNotFoundError | UnexpectedError> {
        const rawVideos = fromPromise<VideoRead[], UnexpectedError>(this.repository.raw(userId), (error: unknown) => {
            if (error instanceof UnexpectedError) {
                return error;
            }
            return new UnexpectedError();
        });

        return rawVideos.andThen((videos) => {
            if (videos.length === 0) {
                return errAsync(new VideoNotFoundError());
            }
            return okAsync(videos);
        });
    }
}
