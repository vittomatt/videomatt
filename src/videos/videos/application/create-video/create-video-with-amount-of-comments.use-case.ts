import { Criteria } from '@shared/domain/repositories/criteria';
import { FilterOperator, Filters } from '@shared/domain/repositories/filters';
import { VideoWithAmountOfComments } from '@videos/videos/domain/models/video-with-amount-of-comments';
import { VideoWithAmountOfCommentsRepository } from '@videos/videos/domain/repositories/video-with-amount-of-comments.repository';
import { VIDEO_TOKEN } from '@videos/videos/infrastructure/di/video.tokens';

import { inject, injectable } from 'tsyringe';

type CreateVideoWithAmountOfCommentsUseCaseInput = {
    id: string;
    title: string;
    description: string;
    url: string;
    userId: string;
};

@injectable()
export class CreateVideoWithAmountOfCommentsUseCase {
    constructor(
        @inject(VIDEO_TOKEN.VIDEO_WITH_AMOUNT_OF_COMMENTS_REPOSITORY)
        private readonly repository: VideoWithAmountOfCommentsRepository<VideoWithAmountOfComments>
    ) {}

    async execute({ id, title, description, url, userId }: CreateVideoWithAmountOfCommentsUseCaseInput): Promise<void> {
        const criteria = Criteria.create().addFilter(Filters.create('id', FilterOperator.EQUALS, id));
        const videoWithAmountOfCommentsRead = await this.repository.search(criteria);
        if (videoWithAmountOfCommentsRead.isOk() && videoWithAmountOfCommentsRead.value.length > 0) {
            return;
        }

        const newVideoWithAmountOfComments = VideoWithAmountOfComments.create({ id, title, description, url, userId });
        const addVideoWithAmountOfCommentsResult = await this.repository.add(newVideoWithAmountOfComments);
        if (addVideoWithAmountOfCommentsResult.isErr()) {
            throw addVideoWithAmountOfCommentsResult.error;
        }
    }
}
