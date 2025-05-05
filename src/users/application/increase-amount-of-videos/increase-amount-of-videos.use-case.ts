import { UserNotFoundError } from '@users/domain/errors/user-not-found.error';
import { User } from '@users/domain/models/write/user';
import { UserRepository } from '@users/domain/repositories/user.repository';
import { USER_TOKEN } from '@users/infrastructure/di/tokens-user';

import { inject, injectable } from 'tsyringe';

@injectable()
export class IncreaseAmountOfVideosUseCase {
    constructor(@inject(USER_TOKEN.REPOSITORY) private readonly userRepository: UserRepository<User>) {}

    async execute(userId: string, videoId: string) {
        const user = await this.userRepository.searchById(userId);
        if (!user) {
            throw new UserNotFoundError();
        }

        user.increaseAmountOfVideos();
        await this.userRepository.update(user);
    }
}
