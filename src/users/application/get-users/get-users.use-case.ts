import { ExtractPrimitives } from '@shared/domain/models/extract-primitives';
import { Criteria } from '@shared/domain/repositories/criteria';
import { User } from '@users/domain/models/user';
import { UserRepository } from '@users/domain/repositories/user.repository';
import { USER_TOKEN } from '@users/infrastructure/di/user.tokens';

import { inject, injectable } from 'tsyringe';

@injectable()
export class GetUsersUseCase {
    constructor(@inject(USER_TOKEN.REPOSITORY) private readonly repository: UserRepository<User>) {}

    async execute(): Promise<ExtractPrimitives<User>[]> {
        const criteria = Criteria.create();
        const userReads = await this.repository.search(criteria);
        if (userReads.isErr()) {
            throw userReads.error;
        }

        const users = userReads.value as ExtractPrimitives<User>[];
        return users;
    }
}
