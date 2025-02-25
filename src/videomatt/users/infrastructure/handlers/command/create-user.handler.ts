import { CreateUserUseCase } from '@videomatt/users/application/create-user/create-user.use-case';
import { UserAlreadyExistsError } from '@videomatt/users/domain/errors/user-already-exists.error';
import { UserCreatedEvent } from '@videomatt/users/domain/events/user-created.event';
import { CommandHandler } from '@videomatt/shared/domain/event-bus/command.handler';
import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain.event';
import { USER_TOKEN } from '@videomatt/users/infrastructure/di/tokens-user';
import { inject, injectable } from 'tsyringe';
import { Either } from 'fp-ts/lib/Either';

@injectable()
export class CreateUserHandler implements CommandHandler<UserAlreadyExistsError> {
    constructor(
        @inject(USER_TOKEN.CREATE_USER_USE_CASE)
        private readonly useCase: CreateUserUseCase
    ) {}

    async handle(event: DomainEvent): Promise<Either<UserAlreadyExistsError, void>> {
        const userEvent = event as UserCreatedEvent;
        return this.useCase.execute({
            id: userEvent.id,
            firstName: userEvent.firstName,
            lastName: userEvent.lastName,
        });
    }
}
