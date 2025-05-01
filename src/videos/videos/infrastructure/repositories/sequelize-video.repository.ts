import { Logger } from '@shared/domain/logger/logger';
import { Criteria } from '@shared/domain/repositories/criteria';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { RedisDB } from '@shared/infrastructure/persistence/redis-db';
import { SequelizeCriteriaConverter } from '@shared/infrastructure/repositories/sequelize-criteria.converter';
import { VIDEO_COMMENT_TOKENS } from '@videos/video-comment/infrastructure/di/tokens-video-comment';
import { VideoCommentDBModel } from '@videos/video-comment/infrastructure/models/video-comment.db-model';
import { Video } from '@videos/videos/domain/models/write/video';
import { VideoRepository } from '@videos/videos/domain/repositories/video.repository';
import { VIDEO_TOKEN } from '@videos/videos/infrastructure/di/tokens-video';
import { VideoDBModel } from '@videos/videos/infrastructure/models/video.db-model';

import { inject, injectable } from 'tsyringe';

@injectable()
export class SequelizeVideoRepository implements VideoRepository<Video> {
    constructor(
        @inject(VIDEO_TOKEN.DB_MODEL) private readonly dbVideo: typeof VideoDBModel,
        @inject(VIDEO_COMMENT_TOKENS.DB_MODEL) private readonly dbVideoComment: typeof VideoCommentDBModel,
        @inject(TOKEN.LOGGER) private readonly logger: Logger,
        @inject(TOKEN.REDIS) private readonly redis: RedisDB
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
            const videos = await this.convert(criteria);
            return videos;
        } catch (error) {
            this.logger.error(`Error searching videos: ${error}`);
            return [];
        }
    }

    async searchById(id: string): Promise<Video | null> {
        const videoModel = await this.dbVideo.findByPk(id);
        const video = videoModel ? Video.fromPrimitives(videoModel.toPrimitives()) : null;
        return video;
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
