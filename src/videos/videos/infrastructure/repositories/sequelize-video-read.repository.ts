import { UnexpectedError } from '@shared/domain/errors/unexpected.error';
import { Logger } from '@shared/domain/logger/logger';
import { Criteria } from '@shared/domain/repositories/criteria';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { SequelizeCriteriaConverter } from '@shared/infrastructure/repositories/sequelize-criteria.converter';
import { VideoRead } from '@videos/videos/domain/models/read/video.read';
import { VideoReadRepository } from '@videos/videos/domain/repositories/video-read.repository';
import { VIDEO_TOKEN } from '@videos/videos/infrastructure/di/video.tokens';
import { VideoDBModelRead } from '@videos/videos/infrastructure/models/video.db-read-model';

import { Result, errAsync, okAsync } from 'neverthrow';
import { Sequelize } from 'sequelize';
import { inject, injectable } from 'tsyringe';

@injectable()
export class SequelizeVideoReadRepository implements VideoReadRepository<VideoRead> {
    constructor(
        @inject(VIDEO_TOKEN.DB_MODEL_READ) private readonly dbVideoRead: typeof VideoDBModelRead,
        @inject(TOKEN.LOGGER) private readonly logger: Logger
    ) {}

    async add(video: VideoRead): Promise<Result<void, UnexpectedError>> {
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
            return okAsync(undefined);
        } catch (error) {
            this.logger.error(`Error adding video read: ${error}`);
            return errAsync(new UnexpectedError('Error adding video read'));
        }
    }

    async remove(video: VideoRead): Promise<Result<void, UnexpectedError>> {
        try {
            await this.dbVideoRead.destroy({ where: { id: video.id } });
            return okAsync(undefined);
        } catch (error) {
            this.logger.error(`Error removing video read: ${error}`);
            return errAsync(new UnexpectedError('Error removing video read'));
        }
    }

    async update(video: VideoRead): Promise<Result<void, UnexpectedError>> {
        try {
            await this.dbVideoRead.update(
                { amountOfComments: Sequelize.literal('"amountOfComments" + 1') },
                { where: { id: video.id } }
            );
            return okAsync(undefined);
        } catch (error) {
            this.logger.error(`Error updating video: ${error}`);
            return errAsync(new UnexpectedError('Error updating video'));
        }
    }

    async search(criteria: Criteria): Promise<Result<VideoRead[], UnexpectedError>> {
        try {
            const videos = await this.convert(criteria);
            return okAsync(videos);
        } catch (error) {
            this.logger.error(`Error searching videos: ${error}`);
            return errAsync(new UnexpectedError('Error searching videos'));
        }
    }

    async searchById(id: string): Promise<Result<VideoRead | null, UnexpectedError>> {
        const video = await this.dbVideoRead.findByPk(id);
        if (!video) {
            return errAsync(new UnexpectedError('Video not found'));
        }
        return okAsync(VideoRead.fromPrimitives(video));
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
