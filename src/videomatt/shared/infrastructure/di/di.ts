import { container } from 'tsyringe';
import { SNSClient } from '@aws-sdk/client-sns';
import { SQSClient } from '@aws-sdk/client-sqs';

import { getEnvs } from '@videomatt/shared/envs/init-envs';
import { DBModel } from '@videomatt/shared/infrastructure/persistence/db';
import { ErrorController } from '@videomatt/shared/infrastructure/controllers/error.controller';
import { PinoLogger } from '@videomatt/shared/infrastructure/logger/pino';
import { InMemoryEventBus } from '@videomatt/shared/infrastructure/event-bus/in-memory-event-bus';
import { DBVideoRepository } from '@videomatt/videos/infrastructure/repositories/db-video.repository';
import { CreateVideoController } from '@videomatt/videos/infrastructure/controllers/create-video/create-video.controller';
import { CreateVideoUseCase } from '@videomatt/videos/application/create-video.use-case';
import { DBUserRepository } from '@videomatt/users/infrastructure/repositories/db-user.repository';
import { SNSUserEventPublisher } from '@videomatt/users/infrastructure/broker/sns-user-event.publisher';
import { IncreaseAmountOfVideosUseCase } from '@videomatt/users/application/increase-amount-of-videos.use-case';
import { SNSVideoEventPublisher } from '@videomatt/videos/infrastructure/broker/sns-video-event.publisher';
import { SQSUserEventConsumer } from '@videomatt/users/infrastructure/broker/sqs-user-event.consumer';
import { SQSVideoEventConsumer } from '@videomatt/videos/infrastructure/broker/sqs-video-event.consumer';
import { VideoHandler } from '@videomatt/videos/infrastructure/handlers/video.handler';
import { UserHandler } from '@videomatt/users/infrastructure/handlers/user.handler';
import { TOKEN } from './tokens';

export class DI {
    constructor(private readonly db: DBModel) {}

    public initDi() {
        this.injectSharedDependencies();
        this.injectUserDependencies();
        this.injectVideoDependencies();
    }

    private injectSharedDependencies() {
        const awsRegion = getEnvs().AWS_REGION;

        container.register(TOKEN.SHARED.ERROR_CONTROLLER, {
            useClass: ErrorController,
        });
        container.register(TOKEN.SHARED.EVENT_BUS, {
            useClass: InMemoryEventBus,
        });
        container.register(TOKEN.SHARED.SNS_CLIENT, {
            useValue: new SNSClient({ region: awsRegion }),
        });
        container.register(TOKEN.SHARED.SQS_CLIENT, {
            useValue: new SQSClient({
                region: awsRegion,
            }),
        });
        container.register(TOKEN.SHARED.LOGGER, {
            useClass: PinoLogger,
        });
    }

    private injectUserDependencies() {
        container.register(TOKEN.USER.REPOSITORY, {
            useClass: DBUserRepository,
        });
        container.register(TOKEN.USER.DB_MODEL, {
            useValue: this.db.getUserModel(),
        });
        container.register(TOKEN.USER.SNS_TOPIC_ARN, {
            useValue: getEnvs().SNS_USER_TOPIC_ARN,
        });
        container.register(TOKEN.USER.SNS_EVENT_PUBLISHER, {
            useClass: SNSUserEventPublisher,
        });
        container.register(TOKEN.USER.SQS_QUEUE_URL, {
            useValue: getEnvs().SQS_USER_QUEUE_URL,
        });
        container.register(TOKEN.USER.SQS_EVENT_CONSUMER, {
            useClass: SQSUserEventConsumer,
        });
        container.register(TOKEN.USER.HANDLER, {
            useClass: UserHandler,
        });
        container.register(TOKEN.USER.INCREASE_AMOUNT_OF_VIDEOS_USE_CASE, {
            useClass: IncreaseAmountOfVideosUseCase,
        });
    }

    private injectVideoDependencies() {
        container.register(TOKEN.VIDEO.REPOSITORY, {
            useClass: DBVideoRepository,
        });
        container.register(TOKEN.VIDEO.DB_MODEL, {
            useValue: this.db.getVideoModel(),
        });
        container.register(TOKEN.VIDEO.SNS_TOPIC_ARN, {
            useValue: getEnvs().SNS_VIDEO_TOPIC_ARN,
        });
        container.register(TOKEN.VIDEO.SNS_EVENT_PUBLISHER, {
            useClass: SNSVideoEventPublisher,
        });
        container.register(TOKEN.VIDEO.SQS_QUEUE_URL, {
            useValue: getEnvs().SQS_VIDEO_QUEUE_URL,
        });
        container.register(TOKEN.VIDEO.SQS_EVENT_CONSUMER, {
            useClass: SQSVideoEventConsumer,
        });
        container.register(TOKEN.VIDEO.HANDLER, {
            useClass: VideoHandler,
        });
        container.register(TOKEN.VIDEO.CREATE_VIDEO_CONTROLLER, {
            useClass: CreateVideoController,
        });
        container.register(TOKEN.VIDEO.CREATE_VIDEO_USE_CASE, {
            useClass: CreateVideoUseCase,
        });
    }
}
