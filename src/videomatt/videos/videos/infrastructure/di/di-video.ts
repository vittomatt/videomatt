import { IncreaseAmountOfCommentsOnCommentAddedHandler } from '@videomatt/videos/videos/infrastructure/handlers/increase-amount-of-comments-on-comment-added.handler';
import { IncreaseAmountOfCommentsUseCase } from '@videomatt/videos/videos/application/increase-amount-of-comments/increase-amount-of-comments.use-case';
import { CreateVideoReadOnVideoPublishedHandler } from '@videomatt/videos/videos/infrastructure/handlers/create-video-read-on-video-published.handler';
import { SequelizeGetVideosRepository } from '@videomatt/videos/videos/infrastructure/repositories/get-videos/sequelize-get-videos.repository';
import { SQSEventCommentAddedConsumer } from '@videomatt/videos/videos/infrastructure/broker/consumers/sqs-event-comment-added.consumer';
import { SQSEventVideoPublishedConsumer } from '@videomatt/users/infrastructure/broker/consumers/sqs-event-video-published.consumer';
import { PublishVideoController } from '@videomatt/videos/videos/infrastructure/controllers/publish-video/publish-video.controller';
import { SequelizeVideoReadRepository } from '@videomatt/videos/videos/infrastructure/repositories/sequelize-video-read.repository';
import { GetVideosController } from '@videomatt/videos/videos/infrastructure/controllers/get-videos/get-videos.controller';
import { SequelizeVideoRepository } from '@videomatt/videos/videos/infrastructure/repositories/sequelize-video.repository';
import { CreateVideoReadUseCase } from '@videomatt/videos/videos/application/publish-video/create-video-read.use-case';
import { SNSVideoEventPublisher } from '@videomatt/videos/videos/infrastructure/broker/sns-video-event.publisher';
import { PublishVideoUseCase } from '@videomatt/videos/videos/application/publish-video/publish-video.use-case';
import { GetVideosUseCase } from '@videomatt/videos/videos/application/get-videos/get-videos.use-case';
import { DBModel } from '@videomatt/shared/infrastructure/persistence/db';
import { getEnvs } from '@videomatt/shared/infrastructure/envs/init-envs';
import { VIDEO_TOKENS } from './tokens-video';
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
        container.register(VIDEO_TOKENS.DB_MODEL, {
            useValue: this.db.getVideoModel(),
        });
        container.register(VIDEO_TOKENS.DB_MODEL_READ, {
            useValue: this.db.getVideoModelRead(),
        });
    }

    private initControllersDependencies() {
        container.register(VIDEO_TOKENS.PUBLISH_VIDEO_CONTROLLER, {
            useClass: PublishVideoController,
        });
        container.register(VIDEO_TOKENS.GET_VIDEOS_CONTROLLER, {
            useClass: GetVideosController,
        });
    }

    private initUseCasesDependencies() {
        container.register(VIDEO_TOKENS.PUBLISH_VIDEO_USE_CASE, {
            useClass: PublishVideoUseCase,
        });
        container.register(VIDEO_TOKENS.GET_VIDEOS_USE_CASE, {
            useClass: GetVideosUseCase,
        });
        container.register(VIDEO_TOKENS.CREATE_VIDEO_READ_USE_CASE, {
            useClass: CreateVideoReadUseCase,
        });
        container.register(VIDEO_TOKENS.INCREASE_AMOUNT_OF_COMMENTS_USE_CASE, {
            useClass: IncreaseAmountOfCommentsUseCase,
        });
    }

    private initBrokerDependencies() {
        // SNS
        container.register(VIDEO_TOKENS.SNS_TOPIC_ARN, {
            useValue: getEnvs().SNS_VIDEO_TOPIC_ARN,
        });
        container.register(VIDEO_TOKENS.SNS_EVENT_PUBLISHER, {
            useClass: SNSVideoEventPublisher,
        });

        // SQS
        container.register(VIDEO_TOKENS.SQS_VIDEO_PUBLISHED_QUEUE_URL, {
            useValue: getEnvs().SQS_VIDEO_PUBLISHED_QUEUE_URL,
        });
        container.register(VIDEO_TOKENS.SQS_COMMENT_ADDED_QUEUE_URL, {
            useValue: getEnvs().SQS_COMMENT_ADDED_QUEUE_URL,
        });

        // Consumers
        container.register(VIDEO_TOKENS.SQS_EVENT_VIDEO_PUBLISHED_CONSUMER, {
            useClass: SQSEventVideoPublishedConsumer,
        });
        container.register(VIDEO_TOKENS.SQS_EVENT_COMMENT_ADDED_CONSUMER, {
            useClass: SQSEventCommentAddedConsumer,
        });
    }

    private initRepositoriesDependencies() {
        container.register(VIDEO_TOKENS.REPOSITORY, {
            useClass: SequelizeVideoRepository,
        });
        container.register(VIDEO_TOKENS.GET_VIDEOS_REPOSITORY, {
            useClass: SequelizeGetVideosRepository,
        });
        container.register(VIDEO_TOKENS.VIDEO_READ_REPOSITORY, {
            useClass: SequelizeVideoReadRepository,
        });
    }

    private initHandlersDependencies() {
        container.register(VIDEO_TOKENS.CREATE_VIDEO_READ_ON_VIDEO_PUBLISHED_HANDLER, {
            useClass: CreateVideoReadOnVideoPublishedHandler,
        });
        container.register(VIDEO_TOKENS.INCREASE_AMOUNT_OF_COMMENTS_ON_COMMENT_ADDED_HANDLER, {
            useClass: IncreaseAmountOfCommentsOnCommentAddedHandler,
        });
    }
}
