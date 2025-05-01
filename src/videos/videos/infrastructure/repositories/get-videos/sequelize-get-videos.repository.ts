import { Logger } from '@shared/domain/logger/logger';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { PostgresDB } from '@shared/infrastructure/persistence/sequelize-db';
import { VideoRead } from '@videos/videos/domain/models/read/video.read';
import { GetVideosRepository } from '@videos/videos/domain/repositories/get-videos.repository';
import { VideoDBModelRead } from '@videos/videos/infrastructure/models/video.db-read-model';

import { QueryTypes } from 'sequelize';
import { inject, injectable } from 'tsyringe';

@injectable()
export class SequelizeGetVideosRepository implements GetVideosRepository<VideoRead[]> {
    constructor(
        @inject(TOKEN.DB) private readonly db: PostgresDB,
        @inject(TOKEN.LOGGER) private readonly logger: Logger
    ) {}

    query = `SELECT * FROM videos_reads WHERE "userId" = :userId`;

    async raw(id: string): Promise<VideoRead[]> {
        try {
            const results = await this.db.getDB().query<VideoDBModelRead>(this.query, {
                type: QueryTypes.SELECT,
                replacements: { userId: id },
            });
            const videos = results.map(
                (result) =>
                    new VideoRead(
                        result.id,
                        result.title,
                        result.description,
                        result.url,
                        result.amountOfComments,
                        result.userId
                    )
            );
            return videos;
        } catch (error) {
            this.logger.error(`Error searching for videos: ${error}`);
            return [];
        }
    }
}
