import { UnexpectedError } from '@shared/domain/errors/unexpected.error';
import { Logger } from '@shared/domain/logger/logger';
import { Criteria } from '@shared/domain/repositories/criteria';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { SequelizeCriteriaConverter } from '@shared/infrastructure/repositories/sequelize-criteria.converter';
import {
    VideoWithAmountOfComments,
    VideoWithAmountOfCommentsPrimitives,
} from '@videos/videos/domain/models/video-with-amount-of-comments';
import { VideoWithAmountOfCommentsRepository } from '@videos/videos/domain/repositories/video-with-amount-of-comments.repository';
import { VIDEO_TOKEN } from '@videos/videos/infrastructure/di/video.tokens';
import { VideoWithAmountOfCommentsDBModel } from '@videos/videos/infrastructure/models/video-with-amount-of-comments.db-model';

import { Result, errAsync, okAsync } from 'neverthrow';
import { Sequelize } from 'sequelize';
import { inject, injectable } from 'tsyringe';

@injectable()
export class SequelizeVideoWithAmountOfCommentsRepository
    implements VideoWithAmountOfCommentsRepository<VideoWithAmountOfComments>
{
    constructor(
        @inject(VIDEO_TOKEN.VIDEO_WITH_AMOUNT_OF_COMMENTS_DB_MODEL)
        private readonly dbVideoWithAmountOfComments: typeof VideoWithAmountOfCommentsDBModel,
        @inject(TOKEN.LOGGER) private readonly logger: Logger
    ) {}

    async add(video: VideoWithAmountOfComments): Promise<Result<void, UnexpectedError>> {
        try {
            const videoPrimitives = video.toPrimitives();
            await this.dbVideoWithAmountOfComments.create(videoPrimitives);
            return okAsync(undefined);
        } catch (error) {
            this.logger.error(`Error adding video with amount of comments: ${error}`);
            return errAsync(new UnexpectedError('Error adding video with amount of comments'));
        }
    }

    async remove(video: VideoWithAmountOfComments): Promise<Result<void, UnexpectedError>> {
        const videoId = video.id.value;
        try {
            await this.dbVideoWithAmountOfComments.destroy({ where: { id: videoId } });
            return okAsync(undefined);
        } catch (error) {
            this.logger.error(`Error removing video with amount of comments: ${error}`);
            return errAsync(new UnexpectedError('Error removing video with amount of comments'));
        }
    }

    async update(video: VideoWithAmountOfComments): Promise<Result<void, UnexpectedError>> {
        const videoId = video.id.value;
        try {
            await this.dbVideoWithAmountOfComments.update(
                { amountOfComments: Sequelize.literal('"amountOfComments" + 1') },
                { where: { id: videoId } }
            );
            return okAsync(undefined);
        } catch (error) {
            this.logger.error(`Error updating video: ${error}`);
            return errAsync(new UnexpectedError('Error updating video'));
        }
    }

    async search(criteria: Criteria): Promise<Result<VideoWithAmountOfCommentsPrimitives[], UnexpectedError>> {
        try {
            const videoWithAmountOfCommentsPrimitives = await this.findWithCriteria(criteria);
            return okAsync(videoWithAmountOfCommentsPrimitives);
        } catch (error) {
            this.logger.error(`Error searching videos: ${error}`);
            return errAsync(new UnexpectedError('Error searching videos'));
        }
    }

    async searchById(id: string): Promise<Result<VideoWithAmountOfCommentsPrimitives | null, UnexpectedError>> {
        const videoWithAmountOfCommentsDBModel = await this.dbVideoWithAmountOfComments.findByPk(id);
        if (!videoWithAmountOfCommentsDBModel) {
            return errAsync(new UnexpectedError('Video not found'));
        }
        return okAsync(videoWithAmountOfCommentsDBModel.toPrimitives());
    }

    private async findWithCriteria(criteria: Criteria): Promise<VideoWithAmountOfCommentsPrimitives[]> {
        const converter = new SequelizeCriteriaConverter(criteria);
        const { where, order, offset, limit } = converter.build();

        const videoWithAmountOfCommentsDBModels = await this.dbVideoWithAmountOfComments.findAll({
            where,
            order,
            offset,
            limit,
        });

        const videoWithAmountOfCommentsPrimitives = videoWithAmountOfCommentsDBModels.map((video) =>
            video.toPrimitives()
        );
        return videoWithAmountOfCommentsPrimitives;
    }
}
