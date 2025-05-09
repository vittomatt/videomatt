import { UnexpectedError } from '@shared/domain/errors/unexpected.error';
import { Logger } from '@shared/domain/logger/logger';
import { Criteria } from '@shared/domain/repositories/criteria';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { RedisDB } from '@shared/infrastructure/persistence/redis-db';
import { SequelizeCriteriaConverter } from '@shared/infrastructure/repositories/sequelize-criteria.converter';
import { Video, VideoPrimitives } from '@videos/videos/domain/models/video';
import { VideoRepository } from '@videos/videos/domain/repositories/video.repository';
import { VIDEO_TOKEN } from '@videos/videos/infrastructure/di/video.tokens';
import { VideoDBModel } from '@videos/videos/infrastructure/models/video.db-model';

import { Result, errAsync, okAsync } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

@injectable()
export class SequelizeVideoRepository implements VideoRepository<Video> {
    constructor(
        @inject(VIDEO_TOKEN.DB_MODEL) private readonly dbVideo: typeof VideoDBModel,
        @inject(TOKEN.LOGGER) private readonly logger: Logger,
        @inject(TOKEN.REDIS) private readonly redis: RedisDB
    ) {}

    async add(video: Video): Promise<Result<void, UnexpectedError>> {
        try {
            const videoPrimitives = video.toPrimitives();
            await this.dbVideo.create(videoPrimitives);
            return okAsync(undefined);
        } catch (error) {
            this.logger.error(`Error adding video: ${error}`);
            return errAsync(new UnexpectedError('Error adding video'));
        }
    }

    async remove(video: Video): Promise<Result<void, UnexpectedError>> {
        const id = video.id.value;

        try {
            await this.dbVideo.destroy({ where: { id } });
            return okAsync(undefined);
        } catch (error) {
            this.logger.error(`Error removing video: ${error}`);
            return errAsync(new UnexpectedError('Error removing video'));
        }
    }

    async update(video: Video): Promise<Result<void, UnexpectedError>> {
        const videoPrimitives = video.toPrimitives();

        try {
            await this.dbVideo.update(videoPrimitives, { where: { id: videoPrimitives.id } });
            return okAsync(undefined);
        } catch (error) {
            this.logger.error(`Error updating video: ${error}`);
            return errAsync(new UnexpectedError('Error updating video'));
        }
    }

    async search(criteria: Criteria): Promise<Result<VideoPrimitives[], UnexpectedError>> {
        try {
            const videoPrimitives = await this.findWithCriteria(criteria);
            return okAsync(videoPrimitives);
        } catch (error) {
            this.logger.error(`Error searching videos: ${error}`);
            return errAsync(new UnexpectedError('Error searching videos'));
        }
    }

    async searchById(id: string): Promise<Result<VideoPrimitives | null, UnexpectedError>> {
        const videoDBModel = await this.dbVideo.findByPk(id);
        if (!videoDBModel) {
            return errAsync(new UnexpectedError('Video not found'));
        }
        return okAsync(videoDBModel.toPrimitives());
    }

    private async findWithCriteria(criteria: Criteria): Promise<VideoPrimitives[]> {
        const converter = new SequelizeCriteriaConverter(criteria);
        const { where, order, offset, limit } = converter.build();

        const videoDBModels = await this.dbVideo.findAll({
            where,
            order,
            offset,
            limit,
        });

        return videoDBModels.map((video) => video.toPrimitives());
    }
}
