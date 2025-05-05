import { DTO } from '@shared/domain/dtos/dto';
import { UnexpectedError } from '@shared/domain/errors/unexpected.error';
import { QueryHandler } from '@shared/domain/event-bus/query.handler';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { InMemoryQueryEventBus } from '@shared/infrastructure/event-bus/in-memory-query.event-bus';
import { GetVideosUseCase } from '@videos/videos/application/get-videos/get-videos.use-case';
import { GetVideosDTO } from '@videos/videos/domain/dtos/get-videos.dto';
import { VideoNotFoundError } from '@videos/videos/domain/errors/video-not-found.error';
import { VideoRead } from '@videos/videos/domain/models/read/video.read';
import { VIDEO_TOKEN } from '@videos/videos/infrastructure/di/tokens-video';

import { ResultAsync } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

@injectable()
export class GetVideosQueryHandler implements QueryHandler<VideoRead[]> {
    constructor(
        @inject(VIDEO_TOKEN.GET_VIDEOS_USE_CASE)
        private readonly useCase: GetVideosUseCase,
        @inject(TOKEN.QUERY_EVENT_BUS)
        private readonly queryEventBus: InMemoryQueryEventBus
    ) {
        this.queryEventBus.registerHandler(GetVideosDTO.type, this);
    }

    async handle(dto: DTO): Promise<VideoRead[]> {
        const videoEvent = dto as GetVideosDTO;
        const userId = videoEvent.userId;

        const result: ResultAsync<VideoRead[], VideoNotFoundError | UnexpectedError> = this.useCase.execute(userId);

        return result.match(
            (videos) => videos,
            (error) => {
                throw error;
            }
        );
    }
}
