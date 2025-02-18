import { VideoRepository } from '@videomatt/videos/videos/domain/repositories/video.repository';
import { FilterOperator, Filters } from '@videomatt/shared/domain/repositories/filters';
import { VIDEO_TOKEN } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { UserRepository } from '@videomatt/users/domain/repositories/user.repository';
import { USER_TOKEN } from '@videomatt/users/infrastructure/di/tokens-user';
import { Video } from '@videomatt/videos/videos/domain/models/write/video';
import { Criteria } from '@videomatt/shared/domain/repositories/criteria';
import { User } from '@videomatt/users/domain/models/write/user';
import { inject, injectable } from 'tsyringe';

@injectable()
export class IncreaseAmountOfVideosUseCase {
    constructor(
        @inject(USER_TOKEN.REPOSITORY) private readonly userRepository: UserRepository<User>,
        @inject(VIDEO_TOKEN.REPOSITORY) private readonly videoRepository: VideoRepository<Video>
    ) {}

    async execute(userId: string, videoId: string) {
        const videoExists = await this.videoRepository.check(videoId);
        if (videoExists) {
            return;
        }

        const criteria = Criteria.create().addFilter(Filters.create('id', FilterOperator.EQUALS, userId));
        const users = await this.userRepository.search(criteria);
        if (!users.length) {
            throw new Error('User not found');
        }

        const user = users[0];
        user.increaseAmountOfVideos();
        await this.userRepository.update(user);
        await this.videoRepository.save(videoId);
    }
}
