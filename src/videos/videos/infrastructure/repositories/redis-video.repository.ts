import { Logger } from '@shared/domain/logger/logger';
import { Criteria } from '@shared/domain/repositories/criteria';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { RedisDB } from '@shared/infrastructure/persistence/redis-db';
import { Video } from '@videos/videos/domain/models/write/video';
import { VideoRepository } from '@videos/videos/domain/repositories/video.repository';
import { VIDEO_TOKEN } from '@videos/videos/infrastructure/di/tokens-video';
import { SequelizeVideoRepository } from '@videos/videos/infrastructure/repositories/sequelize-video.repository';

import { inject, injectable } from 'tsyringe';

@injectable()
export class RedisVideoRepository implements VideoRepository<Video> {
    constructor(
        @inject(TOKEN.REDIS) private readonly redis: RedisDB,
        @inject(VIDEO_TOKEN.DB_REPOSITORY) private readonly videoRepository: SequelizeVideoRepository,
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

        try {
            await this.redis.setValue(videoId, videoSerialized);
            await this.videoRepository.update(video);
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
