import { SequelizeCriteriaConverter } from '@videomatt/shared/infrastructure/repositories/sequelize-criteria.converter';
import { VideoCommentDBModel } from '@videomatt/videos/video-comment/infrastructure/models/video-comment.db-model';
import { VIDEO_COMMENT_TOKENS } from '@videomatt/videos/video-comment/infrastructure/di/tokens-video-comment';
import { VideoDBModelRead } from '@videomatt/videos/videos/infrastructure/models/video.db-read-model';
import { VideoRepository } from '@videomatt/videos/videos/domain/repositories/video.repository';
import { VideoDBModel } from '@videomatt/videos/videos/infrastructure/models/video.db-model';
import { VIDEO_TOKENS } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { Video } from '@videomatt/videos/videos/domain/models/write/video';
import { Criteria } from '@videomatt/shared/domain/repositories/criteria';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { Logger } from '@videomatt/shared/domain/logger/logger';
import { inject, injectable } from 'tsyringe';
import { Sequelize } from 'sequelize';

@injectable()
export class SequelizeVideoRepository implements VideoRepository<Video> {
    constructor(
        @inject(VIDEO_TOKENS.DB_MODEL) private readonly dbVideo: typeof VideoDBModel,
        @inject(VIDEO_TOKENS.DB_MODEL_READ) private readonly dbVideoRead: typeof VideoDBModelRead,
        @inject(VIDEO_COMMENT_TOKENS.DB_MODEL) private readonly dbVideoComment: typeof VideoCommentDBModel,
        @inject(TOKEN.LOGGER) private readonly logger: Logger
    ) {}

    async add(video: Video) {
        try {
            const videoPrimitives = video.toPrimitives();
            await this.dbVideo.create(videoPrimitives);

            const videoReadPrimitives = { ...videoPrimitives, amount_of_comments: 1 };
            await this.dbVideoRead.create(videoReadPrimitives);
        } catch (error) {
            this.logger.error(`Error adding video: ${error}`);
        }
    }

    async remove(video: Video) {
        const id = video.id.value;
        try {
            await this.dbVideo.destroy({ where: { id } });
        } catch (error) {
            this.logger.error(`Error removing video: ${error}`);
        }
    }

    async update(video: Video) {
        const videoPrimitives = video.toPrimitives();
        const commentPrimitives = video.comments.map((comment) => comment.toPrimitives());

        try {
            await this.dbVideo.update(videoPrimitives, { where: { id: videoPrimitives.id } });
            await this.dbVideoRead.update(
                { amountOfComments: Sequelize.literal('"amountOfComments" + 1') },
                { where: { id: videoPrimitives.id } }
            );

            const promises = commentPrimitives.map((commentPrimitive) => this.dbVideoComment.create(commentPrimitive));
            await Promise.all(promises);
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
