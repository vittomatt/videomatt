import { VideoReadRepository } from '@videomatt/videos/videos/domain/repositories/video-read.repository';
import { FilterOperator, Filters } from '@videomatt/shared/domain/repositories/filters';
import { VIDEO_TOKEN } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { VideoRead } from '@videomatt/videos/videos/domain/models/read/video.read';
import { Criteria } from '@videomatt/shared/domain/repositories/criteria';
import { inject, injectable } from 'tsyringe';
import { fold } from 'fp-ts/lib/Option';

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
        const videoRead = await this.repository.searchById(criteria);

        fold(
            async () => {
                const newVideoRead = VideoRead.create({ id, title, description, url, userId });
                await this.repository.add(newVideoRead);
            },
            async (_) => {}
        )(videoRead);
    }
}
