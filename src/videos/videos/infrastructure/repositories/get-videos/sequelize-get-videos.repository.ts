import { UnexpectedError } from '@shared/domain/errors/unexpected.error';
import { Logger } from '@shared/domain/logger/logger';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import {
    VideoWithAmountOfComments,
    VideoWithAmountOfCommentsPrimitives,
} from '@videos/videos/domain/models/video-with-amount-of-comments';
import { GetVideosRepository } from '@videos/videos/domain/repositories/get-videos.repository';
import { VideoWithAmountOfCommentsDBModel } from '@videos/videos/infrastructure/models/video-with-amount-of-comments.db-model';
import { PostgresVideosDB } from '@videos/videos/infrastructure/persistence/sequelize-videos.db';

import { Result, errAsync, okAsync } from 'neverthrow';
import { QueryTypes } from 'sequelize';
import { inject, injectable } from 'tsyringe';

@injectable()
export class SequelizeGetVideosRepository implements GetVideosRepository<VideoWithAmountOfComments[]> {
    constructor(
        @inject(TOKEN.DB) private readonly db: PostgresVideosDB,
        @inject(TOKEN.LOGGER) private readonly logger: Logger
    ) {}

    query = `SELECT * FROM video_with_amount_of_comments WHERE "userId" = :userId`;

    async raw(userId: string): Promise<Result<VideoWithAmountOfCommentsPrimitives[], UnexpectedError>> {
        try {
            const videoWithAmountOfCommentsDBModels = await this.db
                .getDB()
                .query<VideoWithAmountOfCommentsDBModel>(this.query, {
                    type: QueryTypes.SELECT,
                    replacements: { userId: userId },
                });
            const videoWithAmountOfComments = videoWithAmountOfCommentsDBModels.map(
                (videoWithAmountOfCommentsDBModel) =>
                    VideoWithAmountOfComments.create({
                        id: videoWithAmountOfCommentsDBModel.id,
                        title: videoWithAmountOfCommentsDBModel.title,
                        description: videoWithAmountOfCommentsDBModel.description,
                        url: videoWithAmountOfCommentsDBModel.url,
                        amountOfComments: videoWithAmountOfCommentsDBModel.amountOfComments,
                        userId: videoWithAmountOfCommentsDBModel.userId,
                    })
            );
            return okAsync(
                videoWithAmountOfComments.map((videoWithAmountOfComments) => videoWithAmountOfComments.toPrimitives())
            );
        } catch (error) {
            this.logger.error(`Error searching for videos: ${error}`);
            return errAsync(new UnexpectedError('Error searching for videos'));
        }
    }
}
