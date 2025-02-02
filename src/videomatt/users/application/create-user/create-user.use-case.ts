import { UserRepository } from '@videomatt/users/domain/repositories/user.repository';
import { DomainEventBus } from '@videomatt/shared/domain/event-bus/domain-event-bus';
import { USER_TOKEN } from '@videomatt/users/infrastructure/di/tokens-user';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { User } from '@videomatt/users/domain/models/write/user';
import { inject, injectable } from 'tsyringe';

@injectable()
export class CreateUserUseCase {
    constructor(
        @inject(USER_TOKEN.REPOSITORY) private readonly repository: UserRepository<User>,
        @inject(TOKEN.DOMAIN_EVENT_BUS) private readonly eventBus: DomainEventBus
    ) {}

    async execute({ id, firstName, lastName }: { id: string; firstName: string; lastName: string }) {
        const user = User.create({ id, firstName, lastName });
        this.repository.add(user);
        this.eventBus.publish(user.pullDomainEvents());
    }
}
