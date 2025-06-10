import { CommandHandler } from '@shared/domain/event-bus/command.handler';
import { DomainEvent } from '@shared/domain/event-bus/domain.event';
import { InMemoryCommandEventBus } from '@shared/infrastructure/event-bus/in-memory-command.event-bus';
import { CreateUserUseCase } from '@users/application/create-user/create-user.use-case';
import { CreateUserDTO } from '@users/domain/dtos/create-user.dto';
import { UserAlreadyExistsError } from '@users/domain/errors/user-already-exists.error';
import { UserCreatedEvent } from '@users/domain/events/user-created.event';

import { inject, injectable } from 'tsyringe';

@injectable()
export class CreateUserCommandHandler implements CommandHandler<UserAlreadyExistsError> {
    constructor(
        @inject(CreateUserUseCase)
        private readonly useCase: CreateUserUseCase,
        @inject(InMemoryCommandEventBus)
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
