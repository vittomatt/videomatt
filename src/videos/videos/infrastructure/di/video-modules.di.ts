import { MongoDBVideoCommentRepository } from '@videos/video-comment/infrastructure/repositories/mongoose-video-comment.repository';
import { getEnvs } from '@videos/videos.envs';
import { SNSVideoEventProducer } from '@videos/videos/infrastructure/broker/producer/sns-video-event.producer';
import { InMemoryEventCommentAddedSubscriber } from '@videos/videos/infrastructure/broker/subscriber/in-memory-event-comment-added.subscriber';
import { InMemoryEventVideoCreatedSubscriber } from '@videos/videos/infrastructure/broker/subscriber/in-memory-event-video-created.subscriber';
import { VIDEO_TOKEN } from '@videos/videos/infrastructure/di/video.tokens';
import { CreateVideoCommandHandler } from '@videos/videos/infrastructure/handlers/command/create-video.command-handler';
import { GetVideosQueryHandler } from '@videos/videos/infrastructure/handlers/query/get-videos.query-handler';
import { PostgresVideosDB } from '@videos/videos/infrastructure/persistence/sequelize-videos.db';
import { SequelizeGetVideosRepository } from '@videos/videos/infrastructure/repositories/get-videos/sequelize-get-videos.repository';
import { RedisVideoRepository } from '@videos/videos/infrastructure/repositories/redis-video.repository';
import { SequelizeVideoProjectionRepository } from '@videos/videos/infrastructure/repositories/sequelize-video-projection.repository';
import { SequelizeVideoRepository } from '@videos/videos/infrastructure/repositories/sequelize-video.repository';

import { container } from 'tsyringe';

export class DIVideos {
    constructor(private readonly db: PostgresVideosDB) {}

    public initDI() {
        this.initDBDependencies();
        this.initRepositoriesDependencies();
        this.initBrokerDependencies();
    }

    public initSingletons() {
        // Publishers and subscribers
        container.resolve(SNSVideoEventProducer);
        container.resolve(InMemoryEventVideoCreatedSubscriber);
        container.resolve(InMemoryEventCommentAddedSubscriber);

        // CQRS Handlers
        container.resolve(GetVideosQueryHandler);
        container.resolve(CreateVideoCommandHandler);
    }

    private initDBDependencies() {
        container.register(VIDEO_TOKEN.DB_MODEL, {
            useValue: this.db.getVideoModel(),
        });
        container.register(VIDEO_TOKEN.VIDEO_PROJECTION_DB_MODEL, {
            useValue: this.db.getVideoProjectionModel(),
        });
    }

    private initBrokerDependencies() {
        // SNS
        container.register(VIDEO_TOKEN.SNS_TOPIC_ARN, {
            useValue: getEnvs().SNS_VIDEO_TOPIC_ARN,
        });
    }

    private initRepositoriesDependencies() {
        container.register(VIDEO_TOKEN.DB_REPOSITORY, {
            useClass: SequelizeVideoRepository,
        });
        container.register(VIDEO_TOKEN.REPOSITORY, {
            useClass: RedisVideoRepository,
        });
        container.register(VIDEO_TOKEN.GET_VIDEOS_REPOSITORY, {
            useClass: SequelizeGetVideosRepository,
        });
        container.register(VIDEO_TOKEN.VIDEO_PROJECTION_REPOSITORY, {
            useClass: SequelizeVideoProjectionRepository,
        });
        container.register(VIDEO_TOKEN.VIDEO_COMMENT_REPOSITORY, {
            useClass: MongoDBVideoCommentRepository,
        });
    }
}
