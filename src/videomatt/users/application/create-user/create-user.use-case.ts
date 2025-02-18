import { FilterOperator, Filters } from '@videomatt/shared/domain/repositories/filters';
import { UserRepository } from '@videomatt/users/domain/repositories/user.repository';
import { DomainEventBus } from '@videomatt/shared/domain/event-bus/domain-event-bus';
import { USER_TOKEN } from '@videomatt/users/infrastructure/di/tokens-user';
import { Criteria } from '@videomatt/shared/domain/repositories/criteria';
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
        const criteria = Criteria.create().addFilter(Filters.create('id', FilterOperator.EQUALS, id));
        const user = await this.repository.search(criteria);
        if (user.length) {
            return;
        }

        const newUser = User.create({ id, firstName, lastName });
        this.repository.add(newUser);
        this.eventBus.publish(newUser.pullDomainEvents());
    }
}
