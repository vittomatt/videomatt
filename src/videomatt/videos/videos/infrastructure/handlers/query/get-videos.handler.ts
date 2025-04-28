import { inject, injectable } from 'tsyringe';

import { DTO } from '@videomatt/shared/domain/dtos/dto';
import { QueryHandler } from '@videomatt/shared/domain/event-bus/query.handler';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { InMemoryQueryEventBus } from '@videomatt/shared/infrastructure/event-bus/in-memory-query.event-bus';
import { GetVideosUseCase } from '@videomatt/videos/videos/application/get-videos/get-videos.use-case';
import { GetVideosDTO } from '@videomatt/videos/videos/domain/dtos/get-videos.dto';
import { VideoRead } from '@videomatt/videos/videos/domain/models/read/video.read';
import { VIDEO_TOKEN } from '@videomatt/videos/videos/infrastructure/di/tokens-video';

@injectable()
export class GetVideosHandler implements QueryHandler<VideoRead[]> {
    constructor(
        @inject(VIDEO_TOKEN.GET_VIDEOS_USE_CASE)
        private readonly useCase: GetVideosUseCase,
        @inject(TOKEN.QUERY_EVENT_BUS)
        private readonly queryEventBus: InMemoryQueryEventBus
    ) {
        this.queryEventBus.registerHandler(GetVideosDTO.type, this);
    }

    handle(dto: DTO): Promise<VideoRead[]> {
        const videoEvent = dto as GetVideosDTO;
        return this.useCase.execute(videoEvent.userId);
    }
}
