import { Criteria } from '@shared/domain/repositories/criteria';
import { FilterOperator, Filters } from '@shared/domain/repositories/filters';
import { VideoProjection } from '@videos/videos/domain/models/video-projection';
import { VideoProjectionRepository } from '@videos/videos/domain/repositories/video-projection.repository';
import { VIDEO_TOKEN } from '@videos/videos/infrastructure/di/video.tokens';

import { inject, injectable } from 'tsyringe';

type CreateVideoProjectionInput = {
    id: string;
    title: string;
    description: string;
    url: string;
    userId: string;
};

@injectable()
export class CreateVideoProjection {
    constructor(
        @inject(VIDEO_TOKEN.VIDEO_PROJECTION_REPOSITORY)
        private readonly repository: VideoProjectionRepository<VideoProjection>
    ) {}

    async execute({ id, title, description, url, userId }: CreateVideoProjectionInput): Promise<void> {
        const criteria = Criteria.create().addFilter(Filters.create('id', FilterOperator.EQUALS, id));
        const VideoProjectionRead = await this.repository.search(criteria);
        if (VideoProjectionRead.isOk() && VideoProjectionRead.value.length > 0) {
            return;
        }

        const newVideoProjection = VideoProjection.create({ id, title, description, url, userId });
        const addVideoProjectionResult = await this.repository.add(newVideoProjection);
        if (addVideoProjectionResult.isErr()) {
            throw addVideoProjectionResult.error;
        }
    }
}
