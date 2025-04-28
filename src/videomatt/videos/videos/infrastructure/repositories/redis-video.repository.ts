import { inject, injectable } from 'tsyringe';

import { VideoCommentDBModel } from '@videomatt/videos/video-comment/infrastructure/models/video-comment.db-model';
import { VIDEO_COMMENT_TOKENS } from '@videomatt/videos/video-comment/infrastructure/di/tokens-video-comment';
import { VideoRepository } from '@videomatt/videos/videos/domain/repositories/video.repository';
import { VIDEO_TOKEN } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { RedisDB } from '@videomatt/shared/infrastructure/persistence/redis-db';
import { Video } from '@videomatt/videos/videos/domain/models/write/video';
import { Criteria } from '@videomatt/shared/domain/repositories/criteria';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { Logger } from '@videomatt/shared/domain/logger/logger';

import { SequelizeVideoRepository } from './sequelize-video.repository';

@injectable()
export class RedisVideoRepository implements VideoRepository<Video> {
    constructor(
        @inject(TOKEN.REDIS) private readonly redis: RedisDB,
        @inject(VIDEO_TOKEN.DB_REPOSITORY) private readonly videoRepository: SequelizeVideoRepository,
        @inject(VIDEO_COMMENT_TOKENS.DB_MODEL) private readonly dbVideoComment: typeof VideoCommentDBModel,
        @inject(TOKEN.LOGGER) private readonly logger: Logger
    ) {}

    async add(video: Video) {
        const videoId = video.id.value;

        try {
            const foundVideo = await this.redis.getValue(videoId);
            if (foundVideo) {
                return;
            }

            const videoPrimitives = video.toPrimitives();
            const videoSerialized = JSON.stringify(videoPrimitives);
            await this.redis.setValue(videoId, videoSerialized);

            await this.videoRepository.add(video);
        } catch (error) {
            this.logger.error(`Error adding video: ${error}`);
        }
    }

    async remove(video: Video) {
        const videoId = video.id.value;

        try {
            await this.redis.deleteValue(videoId);
            await this.videoRepository.remove(video);
        } catch (error) {
            this.logger.error(`Error removing video: ${error}`);
        }
    }

    async update(video: Video) {
        const videoId = video.id.value;
        const videoPrimitives = video.toPrimitives();
        const videoSerialized = JSON.stringify(videoPrimitives);

        const commentPrimitives = video.comments.map((comment) => comment.toPrimitives());

        try {
            await this.redis.setValue(videoId, videoSerialized);
            await this.videoRepository.update(video);

            const promises = commentPrimitives.map((commentPrimitive) => this.dbVideoComment.create(commentPrimitive));
            await Promise.all(promises);
        } catch (error) {
            this.logger.error(`Error updating video: ${error}`);
        }
    }

    async search(criteria: Criteria): Promise<Video[]> {
        return this.videoRepository.search(criteria);
    }

    async searchById(id: string): Promise<Video | null> {
        const videoSerialized = await this.redis.getValue(id);
        const video = videoSerialized ? Video.fromPrimitives(JSON.parse(videoSerialized)) : null;
        return video ?? this.videoRepository.searchById(id);
    }
}
