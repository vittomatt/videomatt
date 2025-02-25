import { UserAlreadyExistsError } from '@videomatt/users/domain/errors/user-already-exists.error';
import { FilterOperator, Filters } from '@videomatt/shared/domain/repositories/filters';
import { UserRepository } from '@videomatt/users/domain/repositories/user.repository';
import { DomainEventBus } from '@videomatt/shared/domain/event-bus/domain-event-bus';
import { USER_TOKEN } from '@videomatt/users/infrastructure/di/tokens-user';
import { Criteria } from '@videomatt/shared/domain/repositories/criteria';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { User } from '@videomatt/users/domain/models/write/user';
import { Either, left, right } from 'fp-ts/lib/Either';
import { inject, injectable } from 'tsyringe';
import { fold } from 'fp-ts/lib/Option';
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
    }): Promise<Either<UserAlreadyExistsError, void>> {
        const criteria = Criteria.create().addFilter(Filters.create('id', FilterOperator.EQUALS, id));
        const user = await this.repository.searchById(criteria);

        return fold<User, Promise<Either<UserAlreadyExistsError, void>>>(
            async () => {
                const newUser = User.create({ id, firstName, lastName });
                await this.repository.add(newUser);
                await this.eventBus.publish(newUser.pullDomainEvents());
                return right(undefined);
            },
            async (existingUser) => left(new UserAlreadyExistsError())
        )(user);
    }
}
