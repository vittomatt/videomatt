import { ExtractPrimitives } from '@shared/domain/models/extract-primitives';
import { UserNotFoundError } from '@users/domain/errors/user-not-found.error';
import { User } from '@users/domain/models/user';
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
        const userRead = await this.userRepository.searchById(userId);
        if (userRead.isErr() || !userRead.value) {
            throw new UserNotFoundError();
        }

        const user = User.fromPrimitives(userRead.value as ExtractPrimitives<User>);

        user.increaseAmountOfVideos();
        const updateUserResult = await this.userRepository.update(user);
        if (updateUserResult.isErr()) {
            throw updateUserResult.error;
        }
    }
}
