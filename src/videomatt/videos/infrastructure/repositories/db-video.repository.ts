import { inject, injectable } from 'tsyringe';

import { SequelizeCriteriaConverter } from '@videomatt/shared/infrastructure/repositories/db-criteria.converter';
import { VideoRepository } from '@videomatt/videos/domain/repositories/video.repository';
import { Video } from '@videomatt/videos/domain/models/video';
import { DBVideo } from '@videomatt/videos/infrastructure/models/db-video.model';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { Logger } from '@videomatt/shared/domain/logger/logger';
import { Criteria } from '@videomatt/shared/domain/repositories/criteria';

@injectable()
export class DBVideoRepository implements VideoRepository<Video> {
    constructor(
        @inject(TOKEN.VIDEO.DB_MODEL) private readonly dbVideo: typeof DBVideo,
        @inject(TOKEN.SHARED.LOGGER) private readonly logger: Logger
    ) {}

    async add(video: Video) {
        try {
            const videoPrimitives = video.toPrimitives();
            this.dbVideo.create(videoPrimitives);
        } catch (error) {
            this.logger.error(`Error adding video: ${error}`);
        }
    }

    async remove(video: Video) {
        const id = video.id.value;
        try {
            this.dbVideo.destroy({ where: { id } });
        } catch (error) {
            this.logger.error(`Error removing video: ${error}`);
        }
    }

    async update(video: Video) {
        const videoPrimitives = video.toPrimitives();
        try {
            this.dbVideo.update(videoPrimitives, { where: { id: videoPrimitives.id } });
        } catch (error) {
            this.logger.error(`Error updating video: ${error}`);
        }
    }

    async search(criteria: Criteria): Promise<Video[]> {
        try {
            const videos = await this.convert(criteria);
            return videos;
        } catch (error) {
            this.logger.error(`Error searching videos: ${error}`);
            return [];
        }
    }

    private async convert(criteria: Criteria): Promise<Video[]> {
        const converter = new SequelizeCriteriaConverter(criteria);
        const { where, order, offset, limit } = converter.build();

        const dbVideos = await this.dbVideo.findAll({
            where,
            order,
            offset,
            limit,
        });

        const videos = dbVideos.map((video) => video.toPrimitives()).map((video) => Video.fromPrimitives(video));

        return videos;
    }
}
