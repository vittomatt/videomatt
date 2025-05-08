import { UnexpectedError } from '@shared/domain/errors/unexpected.error';
import { Logger } from '@shared/domain/logger/logger';
import { Criteria } from '@shared/domain/repositories/criteria';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { RedisDB } from '@shared/infrastructure/persistence/redis-db';
import { VideoAlreadyExistsError } from '@videos/videos/domain/errors/video-already-exists.error';
import { Video } from '@videos/videos/domain/models/write/video';
import { VideoRepository } from '@videos/videos/domain/repositories/video.repository';
import { VIDEO_TOKEN } from '@videos/videos/infrastructure/di/video.tokens';
import { SequelizeVideoRepository } from '@videos/videos/infrastructure/repositories/sequelize-video.repository';

import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

@injectable()
export class RedisVideoRepository implements VideoRepository<Video> {
    constructor(
        @inject(TOKEN.REDIS) private readonly redis: RedisDB,
        @inject(VIDEO_TOKEN.DB_REPOSITORY) private readonly videoRepository: SequelizeVideoRepository,
        @inject(TOKEN.LOGGER) private readonly logger: Logger
    ) {}

    async add(video: Video): Promise<Result<void, UnexpectedError>> {
        const videoId = video.id.value;

        try {
            const foundVideo = await this.redis.getValue(videoId);
            if (foundVideo) {
                return err(new VideoAlreadyExistsError());
            }

            const videoPrimitives = video.toPrimitives();
            const videoSerialized = JSON.stringify(videoPrimitives);
            await this.redis.setValue(videoId, videoSerialized);

            return await this.videoRepository.add(video);
        } catch (error) {
            this.logger.error(`Error adding video: ${error}`);
            return err(new UnexpectedError('Error adding video'));
        }
    }

    async remove(video: Video): Promise<Result<void, UnexpectedError>> {
        const videoId = video.id.value;

        try {
            await this.redis.deleteValue(videoId);
            return await this.videoRepository.remove(video);
        } catch (error) {
            this.logger.error(`Error removing video: ${error}`);
            return err(new UnexpectedError('Error removing video'));
        }
    }

    async update(video: Video): Promise<Result<void, UnexpectedError>> {
        const videoId = video.id.value;
        const videoPrimitives = video.toPrimitives();
        const videoSerialized = JSON.stringify(videoPrimitives);

        try {
            await this.redis.setValue(videoId, videoSerialized);
            return await this.videoRepository.update(video);
        } catch (error) {
            this.logger.error(`Error updating video: ${error}`);
            return err(new UnexpectedError('Error updating video'));
        }
    }

    async search(criteria: Criteria): Promise<Result<Video[], UnexpectedError>> {
        return this.videoRepository.search(criteria);
    }

    async searchById(id: string): Promise<Result<Video | null, UnexpectedError>> {
        const videoSerialized = await this.redis.getValue(id);
        const video = videoSerialized ? Video.fromPrimitives(JSON.parse(videoSerialized)) : null;
        if (video) {
            return ok(video);
        }

        return this.videoRepository.searchById(id);
    }
}
