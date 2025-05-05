import { DTO } from '@shared/domain/dtos/dto';
import { DomainError } from '@shared/domain/errors/domain.error';
import { UnexpectedError } from '@shared/domain/errors/unexpected.error';
import { CommandHandler } from '@shared/domain/event-bus/command.handler';

import { singleton } from 'tsyringe';

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
            throw new UnexpectedError('Handler not found');
        }
        return await handler.handle(dto);
    }
}
