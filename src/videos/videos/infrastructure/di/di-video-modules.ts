import { getEnvs } from '@shared/infrastructure/envs/init-envs';
import { CreateVideoReadUseCase } from '@videos/videos/application/create-video/create-video-read.use-case';
import { CreateVideoUseCase } from '@videos/videos/application/create-video/create-video.use-case';
import { GetVideosUseCase } from '@videos/videos/application/get-videos/get-videos.use-case';
import { IncreaseAmountOfCommentsUseCase } from '@videos/videos/application/increase-amount-of-comments/increase-amount-of-comments.use-case';
import { SNSVideoEventProducer } from '@videos/videos/infrastructure/broker/producer/sns-video-event.producer';
import { InMemoryVideoEventPublisher } from '@videos/videos/infrastructure/broker/publishers/in-memory-video-event.publisher';
import { InMemoryEventCommentAddedSubscriber } from '@videos/videos/infrastructure/broker/subscriber/in-memory-event-comment-added.subscriber';
import { InMemoryEventVideoCreatedSubscriber } from '@videos/videos/infrastructure/broker/subscriber/in-memory-event-video-created.subscriber';
import { CreateVideoController } from '@videos/videos/infrastructure/controllers/create-video/create-video.controller';
import { GetVideosController } from '@videos/videos/infrastructure/controllers/get-videos/get-videos.controller';
import { VIDEO_TOKEN } from '@videos/videos/infrastructure/di/tokens-video';
import { CreateVideoReadHandler } from '@videos/videos/infrastructure/handlers/domain/create-video-read.handler';
import { CreateVideoHandler } from '@videos/videos/infrastructure/handlers/domain/create-video.handler';
import { IncreaseAmountOfCommentsHandler } from '@videos/videos/infrastructure/handlers/increase-amount-of-comments.handler';
import { GetVideosQueryHandler } from '@videos/videos/infrastructure/handlers/query/get-videos.handler';
import { PostgresVideosDB } from '@videos/videos/infrastructure/persistence/sequelize-videos.db';
import { SequelizeGetVideosRepository } from '@videos/videos/infrastructure/repositories/get-videos/sequelize-get-videos.repository';
import { RedisVideoRepository } from '@videos/videos/infrastructure/repositories/redis-video.repository';
import { SequelizeVideoReadRepository } from '@videos/videos/infrastructure/repositories/sequelize-video-read.repository';
import { SequelizeVideoRepository } from '@videos/videos/infrastructure/repositories/sequelize-video.repository';

import { container } from 'tsyringe';

export class DIVideos {
    constructor(private readonly db: PostgresVideosDB) {}

    public initDI() {
        this.initDBDependencies();
        this.initControllersDependencies();
        this.initUseCasesDependencies();
        this.initRepositoriesDependencies();
        this.initBrokerDependencies();
        this.initHandlersDependencies();
    }

    public initSingletons() {
        container.resolve(VIDEO_TOKEN.IN_MEMORY_EVENT_PUBLISHER);
        container.resolve(VIDEO_TOKEN.SNS_EVENT_PRODUCER);
        container.resolve(VIDEO_TOKEN.CREATE_VIDEO_HANDLER);
        container.resolve(VIDEO_TOKEN.IN_MEMORY_EVENT_VIDEO_CREATED_SUBSCRIBER);
        container.resolve(VIDEO_TOKEN.IN_MEMORY_EVENT_COMMENT_ADDED_SUBSCRIBER);
        container.resolve(VIDEO_TOKEN.GET_VIDEOS_HANDLER);
    }

    private initDBDependencies() {
        container.register(VIDEO_TOKEN.DB_MODEL, {
            useValue: this.db.getVideoModel(),
        });
        container.register(VIDEO_TOKEN.DB_MODEL_READ, {
            useValue: this.db.getVideoModelRead(),
        });
    }

    private initControllersDependencies() {
        container.register(VIDEO_TOKEN.PUBLISH_VIDEO_CONTROLLER, {
            useClass: CreateVideoController,
        });
        container.register(VIDEO_TOKEN.GET_VIDEOS_CONTROLLER, {
            useClass: GetVideosController,
        });
    }

    private initUseCasesDependencies() {
        container.register(VIDEO_TOKEN.PUBLISH_VIDEO_USE_CASE, {
            useClass: CreateVideoUseCase,
        });
        container.register(VIDEO_TOKEN.GET_VIDEOS_USE_CASE, {
            useClass: GetVideosUseCase,
        });
        container.register(VIDEO_TOKEN.CREATE_VIDEO_READ_USE_CASE, {
            useClass: CreateVideoReadUseCase,
        });
        container.register(VIDEO_TOKEN.INCREASE_AMOUNT_OF_COMMENTS_USE_CASE, {
            useClass: IncreaseAmountOfCommentsUseCase,
        });
    }

    private initBrokerDependencies() {
        // SNS
        container.register(VIDEO_TOKEN.SNS_TOPIC_ARN, {
            useValue: getEnvs().SNS_VIDEO_TOPIC_ARN,
        });
        container.register(VIDEO_TOKEN.SNS_EVENT_PRODUCER, {
            useClass: SNSVideoEventProducer,
        });
        container.registerSingleton(VIDEO_TOKEN.IN_MEMORY_EVENT_PUBLISHER, InMemoryVideoEventPublisher);

        // Subscribers
        container.register(VIDEO_TOKEN.IN_MEMORY_EVENT_VIDEO_CREATED_SUBSCRIBER, {
            useClass: InMemoryEventVideoCreatedSubscriber,
        });
        container.register(VIDEO_TOKEN.IN_MEMORY_EVENT_COMMENT_ADDED_SUBSCRIBER, {
            useClass: InMemoryEventCommentAddedSubscriber,
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
        container.register(VIDEO_TOKEN.VIDEO_READ_REPOSITORY, {
            useClass: SequelizeVideoReadRepository,
        });
    }

    private initHandlersDependencies() {
        container.register(VIDEO_TOKEN.GET_VIDEOS_HANDLER, {
            useClass: GetVideosQueryHandler,
        });
        container.register(VIDEO_TOKEN.CREATE_VIDEO_HANDLER, {
            useClass: CreateVideoHandler,
        });
        container.register(VIDEO_TOKEN.CREATE_VIDEO_READ_HANDLER, {
            useClass: CreateVideoReadHandler,
        });
        container.register(VIDEO_TOKEN.INCREASE_AMOUNT_OF_COMMENTS_HANDLER, {
            useClass: IncreaseAmountOfCommentsHandler,
        });
    }
}
