import { SequelizeCriteriaConverter } from '@videomatt/shared/infrastructure/repositories/sequelize-criteria.converter';
import { VideoReadRepository } from '@videomatt/videos/videos/domain/repositories/video-read.repository';
import { VideoDBModelRead } from '@videomatt/videos/videos/infrastructure/models/video.db-read-model';
import { VIDEO_TOKEN } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { VideoRead } from '@videomatt/videos/videos/domain/models/read/video.read';
import { RedisDB } from '@videomatt/shared/infrastructure/persistence/redis-db';
import { Criteria } from '@videomatt/shared/domain/repositories/criteria';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { Logger } from '@videomatt/shared/domain/logger/logger';
import { inject, injectable } from 'tsyringe';
import { Sequelize } from 'sequelize';
@injectable()
export class SequelizeVideoReadRepository implements VideoReadRepository<VideoRead> {
    constructor(
        @inject(VIDEO_TOKEN.DB_MODEL_READ) private readonly dbVideoRead: typeof VideoDBModelRead,
        @inject(TOKEN.LOGGER) private readonly logger: Logger,
        @inject(TOKEN.REDIS) private readonly redis: RedisDB
    ) {}

    async check(id: string): Promise<boolean> {
        const value = await this.redis.getValue(id);
        return value !== null;
    }

    async save(id: string): Promise<void> {
        await this.redis.setValue(id, '1');
    }

    async add(video: VideoRead) {
        try {
            const videoPrimitives = {
                id: video.id,
                title: video.title,
                description: video.description,
                url: video.url,
                userId: video.userId,
                amountOfComments: video.amountOfComments,
            };
            await this.dbVideoRead.create(videoPrimitives);
        } catch (error) {
            this.logger.error(`Error adding video read: ${error}`);
        }
    }

    async update(video: VideoRead) {
        try {
            await this.dbVideoRead.update(
                { amountOfComments: Sequelize.literal('"amountOfComments" + 1') },
                { where: { id: video.id } }
            );
        } catch (error) {
            this.logger.error(`Error updating video: ${error}`);
        }
    }

    async search(criteria: Criteria): Promise<VideoRead[]> {
        try {
            const videos = await this.convert(criteria);
            return videos;
        } catch (error) {
            this.logger.error(`Error searching videos: ${error}`);
            return [];
        }
    }

    private async convert(criteria: Criteria): Promise<VideoRead[]> {
        const converter = new SequelizeCriteriaConverter(criteria);
        const { where, order, offset, limit } = converter.build();

        const dbVideos = await this.dbVideoRead.findAll({
            where,
            order,
            offset,
            limit,
        });

        const videos = dbVideos.map((video) => VideoRead.fromPrimitives(video));
        return videos;
    }
}
