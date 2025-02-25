import { GetVideosHandler } from '@videomatt/videos/videos/infrastructure/handlers/query/get-videos.handler';
import { VIDEO_TOKEN } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { GetVideosDTO } from '@videomatt/videos/videos/domain/dtos/get-videos.dto';
import { QueryHandler } from '@videomatt/shared/domain/event-bus/query.handler';
import { DomainError } from '@videomatt/shared/domain/errors/domain.error';
import { DTO } from '@videomatt/shared/domain/dtos/dto';
import { inject, injectable } from 'tsyringe';
import { Either } from 'fp-ts/lib/Either';

@injectable()
export class InMemoryQueryEventBus<E extends DomainError, T> {
    private readonly handlers: Record<string, QueryHandler<E, T>> = {};

    constructor(@inject(VIDEO_TOKEN.GET_VIDEOS_HANDLER) getVideosHandler: GetVideosHandler) {
        this.handlers[GetVideosDTO.name] = getVideosHandler as unknown as QueryHandler<E, T>;
    }

    async publish(dto: DTO): Promise<Either<E, T>> {
        const handler = this.handlers[dto.constructor.name];
        if (!handler) {
            throw new Error('Handler not found');
        }

        return handler.handle(dto);
    }
}
