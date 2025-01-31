import { FilterOperator, Filters } from '@videomatt/shared/domain/repositories/filters';
import { UserRepository } from '@videomatt/users/domain/repositories/user.repository';
import { TOKEN as TOKEN_USER } from '@videomatt/users/infrastructure/di/tokens-user';
import { Criteria } from '@videomatt/shared/domain/repositories/criteria';
import { User } from '@videomatt/users/domain/models/write/user';
import { inject, injectable } from 'tsyringe';

@injectable()
export class IncreaseAmountOfVideosUseCase {
    constructor(@inject(TOKEN_USER.REPOSITORY) private readonly userRepository: UserRepository<User>) {}

    async execute(userId: string) {
        const criteria = Criteria.create().addFilter(Filters.create('id', FilterOperator.EQUALS, userId));
        const users = await this.userRepository.search(criteria);
        if (users.length === 0) {
            throw new Error('User not found');
        }

        const user = users[0];
        user.increaseAmountOfVideos();
        await this.userRepository.update(user);
    }
}
