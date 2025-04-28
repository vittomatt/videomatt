import { singleton } from 'tsyringe';

import { DTO } from '@videomatt/shared/domain/dtos/dto';
import { DomainError } from '@videomatt/shared/domain/errors/domain.error';
import { QueryHandler } from '@videomatt/shared/domain/event-bus/query.handler';

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
