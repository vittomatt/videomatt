import { UnexpectedError } from '@shared/domain/errors/unexpected.error';
import { Logger } from '@shared/domain/logger/logger';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { VideoProjection, VideoProjectionPrimitives } from '@videos/videos/domain/models/video-projection';
import { GetVideosRepository } from '@videos/videos/domain/repositories/get-videos.repository';
import { VideoProjectionDBModel } from '@videos/videos/infrastructure/models/video-projection.db-model';
import { PostgresVideosDB } from '@videos/videos/infrastructure/persistence/sequelize-videos.db';

import { Result, errAsync, okAsync } from 'neverthrow';
import { QueryTypes } from 'sequelize';
import { inject, injectable } from 'tsyringe';

@injectable()
export class SequelizeGetVideosRepository implements GetVideosRepository<VideoProjection[]> {
    constructor(
        @inject(TOKEN.DB) private readonly db: PostgresVideosDB,
        @inject(TOKEN.LOGGER) private readonly logger: Logger
    ) {}

    query = `SELECT * FROM video_projections WHERE "userId" = :userId`;

    async raw(userId: string): Promise<Result<VideoProjectionPrimitives[], UnexpectedError>> {
        try {
            const VideoProjectionDBModels = await this.db.getDB().query<VideoProjectionDBModel>(this.query, {
                type: QueryTypes.SELECT,
                replacements: { userId: userId },
            });
            const videoProjections = VideoProjectionDBModels.map((VideoProjectionDBModel) =>
                VideoProjection.create({
                    id: VideoProjectionDBModel.id,
                    title: VideoProjectionDBModel.title,
                    description: VideoProjectionDBModel.description,
                    url: VideoProjectionDBModel.url,
                    amountOfComments: VideoProjectionDBModel.amountOfComments,
                    userId: VideoProjectionDBModel.userId,
                })
            );
            return okAsync(videoProjections.map((videoProjection) => videoProjection.toPrimitives()));
        } catch (error) {
            this.logger.error(`Error searching for videos: ${error}`);
            return errAsync(new UnexpectedError('Error searching for videos'));
        }
    }
}
