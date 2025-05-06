import { DomainEventBus } from '@shared/domain/event-bus/domain-event-bus';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { UserAlreadyExistsError } from '@users/domain/errors/user-already-exists.error';
import { User } from '@users/domain/models/write/user';
import { UserRepository } from '@users/domain/repositories/user.repository';
import { USER_TOKEN } from '@users/infrastructure/di/user.tokens';

import { inject, injectable } from 'tsyringe';

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
