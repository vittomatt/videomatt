import { Criteria } from '@shared/domain/repositories/criteria';
import { FilterOperator, Filters } from '@shared/domain/repositories/filters';
import { VideoRead } from '@videos/videos/domain/models/read/video.read';
import { VideoReadRepository } from '@videos/videos/domain/repositories/video-read.repository';
import { VIDEO_TOKEN } from '@videos/videos/infrastructure/di/video.tokens';

import { inject, injectable } from 'tsyringe';

@injectable()
export class CreateVideoReadUseCase {
    constructor(
        @inject(VIDEO_TOKEN.VIDEO_READ_REPOSITORY) private readonly repository: VideoReadRepository<VideoRead>
    ) {}

    async execute({
        id,
        title,
        description,
        url,
        userId,
    }: {
        id: string;
        title: string;
        description: string;
        url: string;
        userId: string;
    }) {
        const criteria = Criteria.create().addFilter(Filters.create('id', FilterOperator.EQUALS, id));
        const videoReadExists = await this.repository.search(criteria);
        if (videoReadExists.isOk() && videoReadExists.value.length > 0) {
            return;
        }

        const newVideoRead = VideoRead.create({ id, title, description, url, userId });
        const addVideoReadResult = await this.repository.add(newVideoRead);
        if (addVideoReadResult.isErr()) {
            throw addVideoReadResult.error;
        }
    }
}
