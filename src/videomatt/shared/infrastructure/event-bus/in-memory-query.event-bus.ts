import { singleton } from 'tsyringe';

import { QueryHandler } from '@videomatt/shared/domain/event-bus/query.handler';
import { DomainError } from '@videomatt/shared/domain/errors/domain.error';
import { DTO } from '@videomatt/shared/domain/dtos/dto';

@singleton()
export class InMemoryQueryEventBus {
    private readonly handlers: {
        [key: string]: QueryHandler<any>;
    } = {};

    registerHandler<T extends DTO>(dto: string, handler: QueryHandler<any>): void {
        this.handlers[dto] = handler;
    }

    publish<T extends DTO>(dto: T): Promise<DomainError> {
        const handler = this.handlers[dto.constructor.name];
        return handler.handle(dto);
    }
}
