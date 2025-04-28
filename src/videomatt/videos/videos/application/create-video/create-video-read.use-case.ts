import { inject, injectable } from 'tsyringe';

import { Criteria } from '@videomatt/shared/domain/repositories/criteria';
import { FilterOperator, Filters } from '@videomatt/shared/domain/repositories/filters';
import { VideoRead } from '@videomatt/videos/videos/domain/models/read/video.read';
import { VideoReadRepository } from '@videomatt/videos/videos/domain/repositories/video-read.repository';
import { VIDEO_TOKEN } from '@videomatt/videos/videos/infrastructure/di/tokens-video';

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
        const videoReads = await this.repository.search(criteria);
        if (videoReads.length > 0) {
            return;
        }

        const newVideoRead = VideoRead.create({ id, title, description, url, userId });
        await this.repository.add(newVideoRead);
    }
}
