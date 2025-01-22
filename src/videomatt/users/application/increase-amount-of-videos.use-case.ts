import { inject, injectable } from 'tsyringe';

import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { UserRepository } from '@videomatt/users/domain/repositories/user.repository';
import { User } from '@videomatt/users/domain/models/user';
import { FilterOperator, Filters } from '@videomatt/shared/domain/repositories/filters';
import { Criteria } from '@videomatt/shared/domain/repositories/criteria';

@injectable()
export class IncreaseAmountOfVideosUseCase {
    constructor(@inject(TOKEN.USER.REPOSITORY) private readonly userRepository: UserRepository<User>) {}

    async execute(userId: string) {
        const criteria = Criteria.create().addFilter(new Filters('id', FilterOperator.EQUALS, userId));
        const users = await this.userRepository.search(criteria);
        if (users.length === 0) {
            throw new Error('User not found');
        }

        const user = users[0];
        user.increaseAmountOfVideos();
        await this.userRepository.update(user);
    }
}
