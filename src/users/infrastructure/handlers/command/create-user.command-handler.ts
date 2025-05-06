import { CommandHandler } from '@shared/domain/event-bus/command.handler';
import { DomainEvent } from '@shared/domain/event-bus/domain.event';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { InMemoryCommandEventBus } from '@shared/infrastructure/event-bus/in-memory-command.event-bus';
import { CreateUserUseCase } from '@users/application/create-user/create-user.use-case';
import { CreateUserDTO } from '@users/domain/dtos/create-user.dto';
import { UserAlreadyExistsError } from '@users/domain/errors/user-already-exists.error';
import { UserCreatedEvent } from '@users/domain/events/user-created.event';
import { USER_TOKEN } from '@users/infrastructure/di/user.tokens';

import { inject, injectable } from 'tsyringe';

@injectable()
export class CreateUserCommandHandler implements CommandHandler<UserAlreadyExistsError> {
    constructor(
        @inject(USER_TOKEN.CREATE_USER_USE_CASE)
        private readonly useCase: CreateUserUseCase,
        @inject(TOKEN.COMMAND_EVENT_BUS)
        private readonly eventBus: InMemoryCommandEventBus
    ) {
        this.eventBus.registerHandler(CreateUserDTO.type, this);
    }

    async handle(event: DomainEvent): Promise<UserAlreadyExistsError | void> {
        const userEvent = event as UserCreatedEvent;
        return this.useCase.execute({
            id: userEvent.id,
            firstName: userEvent.firstName,
            lastName: userEvent.lastName,
        });
    }
}
