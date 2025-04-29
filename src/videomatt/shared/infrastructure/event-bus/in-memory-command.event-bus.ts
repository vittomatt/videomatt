import { singleton } from 'tsyringe';

import { DTO } from '@videomatt/shared/domain/dtos/dto';
import { DomainError } from '@videomatt/shared/domain/errors/domain.error';
import { CommandHandler } from '@videomatt/shared/domain/event-bus/command.handler';

@singleton()
export class InMemoryCommandEventBus {
    private readonly handlers: {
        [key: string]: CommandHandler<DomainError>;
    } = {};

    registerHandler(dto: string, handler: CommandHandler<DomainError>): void {
        this.handlers[dto] = handler;
    }

    async publish<T extends DTO>(dto: T): Promise<DomainError | void> {
        const handler = this.handlers[dto.constructor.name];
        if (!handler) {
            throw new Error('Handler not found');
        }
        return await handler.handle(dto);
    }
}
