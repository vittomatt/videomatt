import { FilterOperator, Filters } from '@videomatt/shared/domain/repositories/filters';
import { UserRepository } from '@videomatt/users/domain/repositories/user.repository';
import { USER_TOKEN } from '@videomatt/users/infrastructure/di/tokens-user';
import { Criteria } from '@videomatt/shared/domain/repositories/criteria';
import { User } from '@videomatt/users/domain/models/write/user';
import { inject, injectable } from 'tsyringe';

@injectable()
export class IncreaseAmountOfVideosUseCase {
    constructor(@inject(USER_TOKEN.REPOSITORY) private readonly repository: UserRepository<User>) {}

    async execute(userId: string) {
        const criteria = Criteria.create().addFilter(Filters.create('id', FilterOperator.EQUALS, userId));
        const users = await this.repository.search(criteria);
        if (users.length === 0) {
            throw new Error('User not found');
        }

        const user = users[0];
        user.increaseAmountOfVideos();
        await this.repository.update(user);
    }
}
