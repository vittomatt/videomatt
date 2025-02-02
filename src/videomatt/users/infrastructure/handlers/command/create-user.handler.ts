import { CreateUserUseCase } from '@videomatt/users/application/create-user/create-user.use-case';
import { UserCreatedEvent } from '@videomatt/users/domain/events/user-created.event';
import { CommandHandler } from '@videomatt/shared/domain/event-bus/command.handler';
import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain-event';
import { USER_TOKEN } from '@videomatt/users/infrastructure/di/tokens-user';
import { inject, injectable } from 'tsyringe';

@injectable()
export class CreateUserHandler implements CommandHandler {
    constructor(
        @inject(USER_TOKEN.CREATE_USER_USE_CASE)
        private readonly useCase: CreateUserUseCase
    ) {}

    async handle(event: DomainEvent) {
        const userEvent = event as UserCreatedEvent;
        await this.useCase.execute({
            id: userEvent.id,
            firstName: userEvent.firstName,
            lastName: userEvent.lastName,
        });
    }
}
