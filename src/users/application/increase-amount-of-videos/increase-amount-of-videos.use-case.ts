import { User } from '@users/domain/models/write/user';
import { UserRepository } from '@users/domain/repositories/user.repository';
import { USER_TOKEN } from '@users/infrastructure/di/tokens-user';
import { Video } from '@videos/videos/domain/models/write/video';
import { VideoRepository } from '@videos/videos/domain/repositories/video.repository';
import { VIDEO_TOKEN } from '@videos/videos/infrastructure/di/tokens-video';

import { inject, injectable } from 'tsyringe';

@injectable()
export class IncreaseAmountOfVideosUseCase {
    constructor(
        @inject(USER_TOKEN.REPOSITORY) private readonly userRepository: UserRepository<User>,
        @inject(VIDEO_TOKEN.REPOSITORY) private readonly videoRepository: VideoRepository<Video>
    ) {}

    async execute(userId: string, videoId: string) {
        const video = await this.videoRepository.searchById(videoId);
        if (video) {
            return;
        }

        const user = await this.userRepository.searchById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        user.increaseAmountOfVideos();
        await this.userRepository.update(user);
    }
}
