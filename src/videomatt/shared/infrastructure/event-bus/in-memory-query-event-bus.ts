import { GetVideosHandler } from '@videomatt/videos/videos/infrastructure/handlers/query/get-videos.handler';
import { QueryHandlerMapping } from '@videomatt/shared/infrastructure/event-bus/query-handler-mapping';
import { VIDEO_TOKEN } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { QueryHandler } from '@videomatt/shared/domain/event-bus/query.handler';
import { BaseQueryDTO } from '@videomatt/shared/domain/dtos/dto';
import { inject, injectable } from 'tsyringe';
import { Either } from 'fp-ts/lib/Either';

@injectable()
export class InMemoryQueryEventBus {
    private readonly handlers: {
        [K in keyof QueryHandlerMapping]: QueryHandler<
            QueryHandlerMapping[K]['error'],
            QueryHandlerMapping[K]['result']
        >;
    };

    constructor(@inject(VIDEO_TOKEN.GET_VIDEOS_HANDLER) getVideosHandler: GetVideosHandler) {
        this.handlers = {
            GetVideosDTO: getVideosHandler,
        };
    }

    async publish<T extends BaseQueryDTO>(
        dto: T
    ): Promise<Either<QueryHandlerMapping[T['type']]['error'], QueryHandlerMapping[T['type']]['result']>> {
        const handler = this.handlers[dto.type] as QueryHandler<
            QueryHandlerMapping[T['type']]['error'],
            QueryHandlerMapping[T['type']]['result']
        >;
        if (!handler) {
            throw new Error('Handler not found');
        }
        return await handler.handle(dto);
    }
}
