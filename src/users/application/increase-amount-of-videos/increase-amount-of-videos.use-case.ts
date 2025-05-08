import { UserNotFoundError } from '@users/domain/errors/user-not-found.error';
import { User } from '@users/domain/models/write/user';
import { UserRepository } from '@users/domain/repositories/user.repository';
import { USER_TOKEN } from '@users/infrastructure/di/user.tokens';

import { inject, injectable } from 'tsyringe';

type IncreaseAmountOfVideosUseCaseInput = {
    userId: string;
    videoId: string;
};

@injectable()
export class IncreaseAmountOfVideosUseCase {
    constructor(@inject(USER_TOKEN.REPOSITORY) private readonly userRepository: UserRepository<User>) {}

    async execute({ userId, videoId }: IncreaseAmountOfVideosUseCaseInput): Promise<void> {
        const user = await this.userRepository.searchById(userId);
        if (user.isErr() || !user.value) {
            throw new UserNotFoundError();
        }

        user.value.increaseAmountOfVideos();
        const updateUserResult = await this.userRepository.update(user.value);
        if (updateUserResult.isErr()) {
            throw updateUserResult.error;
        }
    }
}
