import { GetVideosHandler } from '@videomatt/videos/videos/infrastructure/handlers/query/get-videos.handler';
import { VIDEO_TOKEN } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { GetVideosDTO } from '@videomatt/videos/videos/domain/dtos/get-videos.dto';
import { QueryEventBus } from '@videomatt/shared/domain/event-bus/query-event-bus';
import { QueryHandler } from '@videomatt/shared/domain/event-bus/query.handler';
import { DTO } from '@videomatt/shared/domain/dtos/dto';
import { inject, injectable } from 'tsyringe';

@injectable()
export class InMemoryQueryEventBus<T> implements QueryEventBus<T> {
    private readonly handlers: Record<string, QueryHandler<T>> = {};

    constructor(@inject(VIDEO_TOKEN.GET_VIDEOS_HANDLER) getVideosHandler: GetVideosHandler) {
        this.handlers[GetVideosDTO.name] = getVideosHandler as unknown as QueryHandler<T>;
    }

    async publish(dto: DTO): Promise<T> {
        const handler = this.handlers[dto.constructor.name];
        if (!handler) {
            throw new Error('Handler not found');
        }

        return handler.handle(dto);
    }
}
