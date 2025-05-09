import { UnexpectedError } from '@shared/domain/errors/unexpected.error';
import { Logger } from '@shared/domain/logger/logger';
import { Criteria } from '@shared/domain/repositories/criteria';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { SequelizeCriteriaConverter } from '@shared/infrastructure/repositories/sequelize-criteria.converter';
import { VideoProjection, VideoProjectionPrimitives } from '@videos/videos/domain/models/video-projection';
import { VideoProjectionRepository } from '@videos/videos/domain/repositories/video-projection.repository';
import { VIDEO_TOKEN } from '@videos/videos/infrastructure/di/video.tokens';
import { VideoProjectionDBModel } from '@videos/videos/infrastructure/models/video-projection.db-model';

import { Result, errAsync, okAsync } from 'neverthrow';
import { Sequelize } from 'sequelize';
import { inject, injectable } from 'tsyringe';

@injectable()
export class SequelizeVideoProjectionRepository implements VideoProjectionRepository<VideoProjection> {
    constructor(
        @inject(VIDEO_TOKEN.VIDEO_PROJECTION_DB_MODEL)
        private readonly dbVideoProjection: typeof VideoProjectionDBModel,
        @inject(TOKEN.LOGGER) private readonly logger: Logger
    ) {}

    async add(video: VideoProjection): Promise<Result<void, UnexpectedError>> {
        try {
            const videoPrimitives = video.toPrimitives();
            await this.dbVideoProjection.create(videoPrimitives);
            return okAsync(undefined);
        } catch (error) {
            this.logger.error(`Error adding video projection: ${error}`);
            return errAsync(new UnexpectedError('Error adding video projection'));
        }
    }

    async remove(video: VideoProjection): Promise<Result<void, UnexpectedError>> {
        const videoId = video.id.value;
        try {
            await this.dbVideoProjection.destroy({ where: { id: videoId } });
            return okAsync(undefined);
        } catch (error) {
            this.logger.error(`Error removing video projection: ${error}`);
            return errAsync(new UnexpectedError('Error removing video projection'));
        }
    }

    async update(video: VideoProjection): Promise<Result<void, UnexpectedError>> {
        const videoId = video.id.value;
        try {
            await this.dbVideoProjection.update(
                { amountOfComments: Sequelize.literal('"amountOfComments" + 1') },
                { where: { id: videoId } }
            );
            return okAsync(undefined);
        } catch (error) {
            this.logger.error(`Error updating video projection: ${error}`);
            return errAsync(new UnexpectedError('Error updating video projection'));
        }
    }

    async search(criteria: Criteria): Promise<Result<VideoProjectionPrimitives[], UnexpectedError>> {
        try {
            const VideoProjectionPrimitives = await this.findWithCriteria(criteria);
            return okAsync(VideoProjectionPrimitives);
        } catch (error) {
            this.logger.error(`Error searching video projections: ${error}`);
            return errAsync(new UnexpectedError('Error searching video projections'));
        }
    }

    async searchById(id: string): Promise<Result<VideoProjectionPrimitives | null, UnexpectedError>> {
        const VideoProjectionDBModel = await this.dbVideoProjection.findByPk(id);
        if (!VideoProjectionDBModel) {
            return errAsync(new UnexpectedError('Video projection not found'));
        }
        return okAsync(VideoProjectionDBModel.toPrimitives());
    }

    private async findWithCriteria(criteria: Criteria): Promise<VideoProjectionPrimitives[]> {
        const converter = new SequelizeCriteriaConverter(criteria);
        const { where, order, offset, limit } = converter.build();

        const VideoProjectionDBModels = await this.dbVideoProjection.findAll({
            where,
            order,
            offset,
            limit,
        });

        const VideoProjectionPrimitives = VideoProjectionDBModels.map((video) => video.toPrimitives());
        return VideoProjectionPrimitives;
    }
}
