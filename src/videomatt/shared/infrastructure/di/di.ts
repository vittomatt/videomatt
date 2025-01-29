import { AddCommentToVideoController } from '@videomatt/videos/video-comment/infrastructure/controllers/add-comment-to-video/add-comment-to-video.controller';
import { IncreaseAmountOfVideosOnVideoPublishedHandler } from '@videomatt/users/infrastructure/handlers/increase-amount-of-videos-on-video-published.handler';
import { SQSEventVideoPublishedConsumer } from '@videomatt/users/infrastructure/broker/consumers/sqs-event-video-published.consumer';
import { PublishVideoController } from '@videomatt/videos/videos/infrastructure/controllers/publish-video/publish-video.controller';
import { GetVideosController } from '@videomatt/videos/videos/infrastructure/controllers/get-videos/get-videos.controller';
import { AddCommentToVideoUseCase } from '@videomatt/videos/video-comment/application/add-comment-to-video.use-case';
import { SNSVideoEventPublisher } from '@videomatt/videos/videos/infrastructure/broker/sns-video-event.publisher';
import { IncreaseAmountOfVideosUseCase } from '@videomatt/users/application/increase-amount-of-videos.use-case';
import { DBVideoRepository } from '@videomatt/videos/videos/infrastructure/repositories/db-video.repository';
import { CreateUserController } from '@videomatt/users/infrastructure/controllers/create-user.controller';
import { SNSUserEventPublisher } from '@videomatt/users/infrastructure/broker/sns-user-event.publisher';
import { DBUserRepository } from '@videomatt/users/infrastructure/repositories/db-user.repository';
import { InMemoryEventBus } from '@videomatt/shared/infrastructure/event-bus/in-memory-event-bus';
import { PublishVideoUseCase } from '@videomatt/videos/videos/application/publish-video.use-case';
import { ErrorController } from '@videomatt/shared/infrastructure/controllers/error.controller';
import { GetVideosUseCase } from '@videomatt/videos/videos/application/get-videos.use-case';
import { CreateUserUseCase } from '@videomatt/users/application/create-user.user-case';
import { DBModel } from '@videomatt/shared/infrastructure/persistence/db';
import { PinoLogger } from '@videomatt/shared/infrastructure/logger/pino';
import { getEnvs } from '@videomatt/shared/envs/init-envs';
import { SNSClient } from '@aws-sdk/client-sns';
import { SQSClient } from '@aws-sdk/client-sqs';
import { container } from 'tsyringe';
import { TOKEN } from './tokens';

export class DI {
    constructor(private readonly db: DBModel) {}

    public initDi() {
        this.initDBDependencies();
        this.initControllersDependencies();
        this.initUseCasesDependencies();
        this.initHandlersDependencies();
        this.initBrokerDependencies();
        this.initRepositoriesDependencies();
        this.initSharedDependencies();
    }

    private initDBDependencies() {
        container.register(TOKEN.USER.DB_MODEL, {
            useValue: this.db.getUserModel(),
        });
        container.register(TOKEN.VIDEO.DB_MODEL, {
            useValue: this.db.getVideoModel(),
        });
        container.register(TOKEN.VIDEO.DB_MODEL_COMMENT, {
            useValue: this.db.getVideoCommentModel(),
        });
    }

    private initControllersDependencies() {
        container.register(TOKEN.SHARED.ERROR_CONTROLLER, {
            useClass: ErrorController,
        });
        container.register(TOKEN.USER.CREATE_USER_CONTROLLER, {
            useClass: CreateUserController,
        });
        container.register(TOKEN.VIDEO.PUBLISH_VIDEO_CONTROLLER, {
            useClass: PublishVideoController,
        });
        container.register(TOKEN.VIDEO.ADD_COMMENT_TO_VIDEO_CONTROLLER, {
            useClass: AddCommentToVideoController,
        });
        container.register(TOKEN.VIDEO.GET_VIDEOS_CONTROLLER, {
            useClass: GetVideosController,
        });
    }

    private initUseCasesDependencies() {
        container.register(TOKEN.USER.INCREASE_AMOUNT_OF_VIDEOS_USE_CASE, {
            useClass: IncreaseAmountOfVideosUseCase,
        });
        container.register(TOKEN.USER.CREATE_USER_USE_CASE, {
            useClass: CreateUserUseCase,
        });
        container.register(TOKEN.VIDEO.PUBLISH_VIDEO_USE_CASE, {
            useClass: PublishVideoUseCase,
        });
        container.register(TOKEN.VIDEO.ADD_COMMENT_TO_VIDEO_USE_CASE, {
            useClass: AddCommentToVideoUseCase,
        });
        container.register(TOKEN.VIDEO.GET_VIDEOS_USE_CASE, {
            useClass: GetVideosUseCase,
        });
    }

    private initBrokerDependencies() {
        const awsRegion = getEnvs().AWS_REGION;
        // SNS
        container.register(TOKEN.SHARED.SNS_CLIENT, {
            useValue: new SNSClient({ region: awsRegion }),
        });
        container.register(TOKEN.VIDEO.SNS_TOPIC_ARN, {
            useValue: getEnvs().SNS_VIDEO_TOPIC_ARN,
        });
        container.register(TOKEN.USER.SNS_TOPIC_ARN, {
            useValue: getEnvs().SNS_USER_TOPIC_ARN,
        });
        container.register(TOKEN.VIDEO.SNS_EVENT_PUBLISHER, {
            useClass: SNSVideoEventPublisher,
        });
        container.register(TOKEN.USER.SNS_EVENT_PUBLISHER, {
            useClass: SNSUserEventPublisher,
        });

        // SQS
        container.register(TOKEN.SHARED.SQS_CLIENT, {
            useValue: new SQSClient({
                region: awsRegion,
            }),
        });
        container.register(TOKEN.VIDEO.SQS_VIDEO_PUBLISHED_QUEUE_URL, {
            useValue: getEnvs().SQS_VIDEO_PUBLISHED_QUEUE_URL,
        });
        container.register(TOKEN.USER.SQS_USER_CREATED_QUEUE_URL, {
            useValue: getEnvs().SQS_USER_CREATED_QUEUE_URL,
        });
        container.register(TOKEN.VIDEO.SQS_EVENT_PUBLISHED_CONSUMER, {
            useClass: SQSEventVideoPublishedConsumer,
        });
    }

    private initRepositoriesDependencies() {
        container.register(TOKEN.VIDEO.REPOSITORY, {
            useClass: DBVideoRepository,
        });
        container.register(TOKEN.USER.REPOSITORY, {
            useClass: DBUserRepository,
        });
    }

    private initHandlersDependencies() {
        container.register(TOKEN.USER.INCREASE_AMOUNT_OF_VIDEOS_ON_VIDEO_PUBLISHED_HANDLER, {
            useClass: IncreaseAmountOfVideosOnVideoPublishedHandler,
        });
    }

    private initSharedDependencies() {
        container.register(TOKEN.SHARED.EVENT_BUS, {
            useClass: InMemoryEventBus,
        });
        container.register(TOKEN.SHARED.LOGGER, {
            useClass: PinoLogger,
        });
    }
}
