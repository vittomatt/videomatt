import { VideoReadRepository } from '@videomatt/videos/videos/domain/repositories/video-read.repository';
import { FilterOperator, Filters } from '@videomatt/shared/domain/repositories/filters';
import { VIDEO_TOKENS } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { VideoRead } from '@videomatt/videos/videos/domain/models/read/video.read';
import { Criteria } from '@videomatt/shared/domain/repositories/criteria';
import { inject, injectable } from 'tsyringe';

@injectable()
export class IncreaseAmountOfCommentsUseCase {
    constructor(
        @inject(VIDEO_TOKENS.VIDEO_READ_REPOSITORY) private readonly repository: VideoReadRepository<VideoRead>
    ) {}

    async execute(videoId: string) {
        const criteria = Criteria.create().addFilter(Filters.create('id', FilterOperator.EQUALS, videoId));
        const videos = await this.repository.search(criteria);
        if (videos.length === 0) {
            throw new Error('Video not found');
        }

        const video = videos[0];
        video.increaseAmountOfComments();
        this.repository.update(video);
    }
}
