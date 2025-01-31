import { TOKEN as TOKEN_VIDEO_COMMENT } from '@videomatt/videos/video-comment/infrastructure/di/tokens-video-comment';
import { SequelizeCriteriaConverter } from '@videomatt/shared/infrastructure/repositories/db-criteria.converter';
import { DBVideoComment } from '@videomatt/videos/video-comment/infrastructure/models/db-video-comment.model';
import { VideoRepository } from '@videomatt/videos/videos/domain/repositories/video.repository';
import { TOKEN as TOKEN_VIDEO } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { DBVideo } from '@videomatt/videos/videos/infrastructure/models/db-video.model';
import { Criteria } from '@videomatt/shared/domain/repositories/criteria';
import { Video } from '@videomatt/videos/videos/domain/models/video';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { Logger } from '@videomatt/shared/domain/logger/logger';
import { inject, injectable } from 'tsyringe';

@injectable()
export class DBVideoRepository implements VideoRepository<Video> {
    constructor(
        @inject(TOKEN_VIDEO.DB_MODEL) private readonly dbVideo: typeof DBVideo,
        @inject(TOKEN_VIDEO_COMMENT.DB_MODEL_COMMENT) private readonly dbVideoComment: typeof DBVideoComment,
        @inject(TOKEN.LOGGER) private readonly logger: Logger
    ) {}

    async add(video: Video) {
        try {
            const videoPrimitives = video.toPrimitives();
            await this.dbVideo.create(videoPrimitives);
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

            const promises = commentPrimitives.map((commentPrimitive) => this.dbVideoComment.create(commentPrimitive));
            await Promise.all(promises);
        } catch (error) {
            this.logger.error(`Error updating video: ${error}`);
        }
    }

    async search(criteria: Criteria): Promise<Video[]> {
        try {
            const converter = new SequelizeCriteriaConverter(criteria);
            const { where, order, offset, limit, include } = converter.build();

            const dbVideos = await this.dbVideo.findAll({
                where,
                order,
                offset,
                limit,
                include,
            });

            const videos = dbVideos.map((video) => video.toPrimitives()).map((video) => Video.fromPrimitives(video));

            return videos;
        } catch (error) {
            this.logger.error(`Error searching videos: ${error}`);
            return [];
        }
    }
}
