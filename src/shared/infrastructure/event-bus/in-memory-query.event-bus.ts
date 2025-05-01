import { DTO } from '@shared/domain/dtos/dto';
import { DomainError } from '@shared/domain/errors/domain.error';
import { QueryHandler } from '@shared/domain/event-bus/query.handler';

import { singleton } from 'tsyringe';

@singleton()
export class InMemoryQueryEventBus {
    private readonly handlers: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: QueryHandler<any>;
    } = {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    registerHandler(dto: string, handler: QueryHandler<any>): void {
        this.handlers[dto] = handler;
    }

    publish<T extends DTO>(dto: T): Promise<DomainError> {
        const handler = this.handlers[dto.constructor.name];
        return handler.handle(dto);
    }
}
