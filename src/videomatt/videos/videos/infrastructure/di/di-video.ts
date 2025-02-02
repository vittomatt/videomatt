import { IncreaseAmountOfCommentsUseCase } from '@videomatt/videos/videos/application/increase-amount-of-comments/increase-amount-of-comments.use-case';
import { SequelizeGetVideosRepository } from '@videomatt/videos/videos/infrastructure/repositories/get-videos/sequelize-get-videos.repository';
import { SQSEventVideoPublishedConsumer } from '@videomatt/videos/videos/infrastructure/broker/consumers/sqs-event-video-published.consumer';
import { SQSEventCommentAddedConsumer } from '@videomatt/videos/videos/infrastructure/broker/consumers/sqs-event-comment-added.consumer';
import { IncreaseAmountOfCommentsHandler } from '@videomatt/videos/videos/infrastructure/handlers/increase-amount-of-comments.handler';
import { SequelizeVideoReadRepository } from '@videomatt/videos/videos/infrastructure/repositories/sequelize-video-read.repository';
import { CreateVideoController } from '@videomatt/videos/videos/infrastructure/controllers/create-video/create-video.controller';
import { GetVideosController } from '@videomatt/videos/videos/infrastructure/controllers/get-videos/get-videos.controller';
import { CreateVideoReadHandler } from '@videomatt/videos/videos/infrastructure/handlers/domain/create-video-read.handler';
import { SequelizeVideoRepository } from '@videomatt/videos/videos/infrastructure/repositories/sequelize-video.repository';
import { CreateVideoReadUseCase } from '@videomatt/videos/videos/application/create-video/create-video-read.use-case';
import { CreateVideoHandler } from '@videomatt/videos/videos/infrastructure/handlers/domain/create-video.handler';
import { SNSVideoEventPublisher } from '@videomatt/videos/videos/infrastructure/broker/sns-video-event.publisher';
import { GetVideosHandler } from '@videomatt/videos/videos/infrastructure/handlers/query/get-videos.handler';
import { CreateVideoUseCase } from '@videomatt/videos/videos/application/create-video/create-video.use-case';
import { GetVideosUseCase } from '@videomatt/videos/videos/application/get-videos/get-videos.use-case';
import { DBModel } from '@videomatt/shared/infrastructure/persistence/db';
import { getEnvs } from '@videomatt/shared/infrastructure/envs/init-envs';
import { VIDEO_TOKEN } from './tokens-video';
import { container } from 'tsyringe';

export class DIVideos {
    constructor(private readonly db: DBModel) {}

    public initDI() {
        this.initDBDependencies();
        this.initControllersDependencies();
        this.initUseCasesDependencies();
        this.initRepositoriesDependencies();
        this.initBrokerDependencies();
        this.initHandlersDependencies();
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
        container.register(VIDEO_TOKEN.SNS_EVENT_PUBLISHER, {
            useClass: SNSVideoEventPublisher,
        });

        // SQS
        container.register(VIDEO_TOKEN.SQS_VIDEO_PUBLISHED_QUEUE_URL, {
            useValue: getEnvs().SQS_VIDEO_PUBLISHED_QUEUE_URL,
        });
        container.register(VIDEO_TOKEN.SQS_COMMENT_ADDED_QUEUE_URL, {
            useValue: getEnvs().SQS_COMMENT_ADDED_QUEUE_URL,
        });

        // Consumers
        container.register(VIDEO_TOKEN.SQS_EVENT_VIDEO_PUBLISHED_CONSUMER, {
            useClass: SQSEventVideoPublishedConsumer,
        });
        container.register(VIDEO_TOKEN.SQS_EVENT_COMMENT_ADDED_CONSUMER, {
            useClass: SQSEventCommentAddedConsumer,
        });
    }

    private initRepositoriesDependencies() {
        container.register(VIDEO_TOKEN.REPOSITORY, {
            useClass: SequelizeVideoRepository,
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
            useClass: GetVideosHandler,
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
