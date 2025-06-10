import { DTO } from '@shared/domain/dtos/dto';
import { QueryHandler } from '@shared/domain/event-bus/query.handler';
import { InMemoryQueryEventBus } from '@shared/infrastructure/event-bus/in-memory-query.event-bus';
import { GetVideosUseCase } from '@videos/videos/application/get-videos/get-videos.use-case';
import { GetVideosDTO } from '@videos/videos/domain/dtos/get-videos.dto';
import { VideoDTO } from '@videos/videos/infrastructure/dtos/video.dto';

import { inject, injectable } from 'tsyringe';

@injectable()
export class GetVideosQueryHandler implements QueryHandler<VideoDTO[]> {
    constructor(
        @inject(GetVideosUseCase)
        private readonly useCase: GetVideosUseCase,
        @inject(InMemoryQueryEventBus)
        private readonly queryEventBus: InMemoryQueryEventBus
    ) {
        this.queryEventBus.registerHandler(GetVideosDTO.type, this);
    }

    async handle(dto: DTO): Promise<VideoDTO[]> {
        const videoEvent = dto as GetVideosDTO;
        const userId = videoEvent.userId;

        const result = await this.useCase.execute({ userId });

        return result;
    }
}
