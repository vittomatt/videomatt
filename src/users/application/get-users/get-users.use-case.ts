import { Criteria } from '@shared/domain/repositories/criteria';
import { User } from '@users/domain/models/write/user';
import { UserRepository } from '@users/domain/repositories/user.repository';
import { USER_TOKEN } from '@users/infrastructure/di/user.tokens';

import { inject, injectable } from 'tsyringe';

@injectable()
export class GetUsersUseCase {
    constructor(@inject(USER_TOKEN.REPOSITORY) private readonly repository: UserRepository<User>) {}

    // FITU return DTO or read model
    async execute(): Promise<User[]> {
        const criteria = Criteria.create();
        const users = await this.repository.search(criteria);
        if (users.isErr()) {
            throw users.error;
        }

        return users.value;
    }
}
