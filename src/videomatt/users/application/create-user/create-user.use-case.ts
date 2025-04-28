import { inject, injectable } from 'tsyringe';

import { DomainEventBus } from '@videomatt/shared/domain/event-bus/domain-event-bus';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { UserAlreadyExistsError } from '@videomatt/users/domain/errors/user-already-exists.error';
import { User } from '@videomatt/users/domain/models/write/user';
import { UserRepository } from '@videomatt/users/domain/repositories/user.repository';
import { USER_TOKEN } from '@videomatt/users/infrastructure/di/tokens-user';

@injectable()
export class CreateUserUseCase {
    constructor(
        @inject(USER_TOKEN.REPOSITORY) private readonly repository: UserRepository<User>,
        @inject(TOKEN.DOMAIN_EVENT_BUS) private readonly eventBus: DomainEventBus
    ) {}

    async execute({
        id,
        firstName,
        lastName,
    }: {
        id: string;
        firstName: string;
        lastName: string;
    }): Promise<UserAlreadyExistsError | void> {
        const user = await this.repository.searchById(id);

        if (user) {
            return new UserAlreadyExistsError();
        }

        const newUser = User.create({ id, firstName, lastName });
        await this.repository.add(newUser);
        await this.eventBus.publish(newUser.pullDomainEvents());
    }
}
