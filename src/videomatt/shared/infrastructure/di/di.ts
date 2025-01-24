import { container } from 'tsyringe';
import { SNSClient } from '@aws-sdk/client-sns';
import { SQSClient } from '@aws-sdk/client-sqs';

import { getEnvs } from '@videomatt/shared/envs/init-envs';
import { DBModel } from '@videomatt/shared/infrastructure/persistence/db';
import { ErrorController } from '@videomatt/shared/infrastructure/controllers/error.controller';
import { PinoLogger } from '@videomatt/shared/infrastructure/logger/pino';
import { InMemoryEventBus } from '@videomatt/shared/infrastructure/event-bus/in-memory-event-bus';
import { DBVideoRepository } from '@videomatt/videos/infrastructure/repositories/db-video.repository';
import { PublishVideoController } from '@videomatt/videos/infrastructure/controllers/publish-video/publish-video.controller';
import { PublishVideoUseCase } from '@videomatt/videos/application/publish-video.use-case';
import { DBUserRepository } from '@videomatt/users/infrastructure/repositories/db-user.repository';
import { IncreaseAmountOfVideosUseCase } from '@videomatt/users/application/increase-amount-of-videos.use-case';
import { SNSVideoEventPublisher } from '@videomatt/videos/infrastructure/broker/sns-video-event.publisher';
import { IncreaseAmountOfVideosOnVideoPublishedHandler } from '@videomatt/users/infrastructure/handlers/increase-amount-of-videos-on-video-published.handler';
import { SQSEventVideoPublishedConsumer } from '@videomatt/users/infrastructure/broker/consumers/sqs-event-video-published.consumer';
import { CreateUserController } from '@videomatt/users/infrastructure/controllers/create-user.controller';
import { CreateUserUseCase } from '@videomatt/users/application/create-user.user-case';
import { SNSUserEventPublisher } from '@videomatt/users/infrastructure/broker/sns-user-event.publisher';
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
        container.register(TOKEN.VIDEO.SQS_QUEUE_URL, {
            useValue: getEnvs().SQS_VIDEO_QUEUE_URL,
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
