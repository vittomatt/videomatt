import { getEnvs } from '@shared/infrastructure/envs/init-envs';
import { CreateUserUseCase } from '@users/application/create-user/create-user.use-case';
import { GetUsersUseCase } from '@users/application/get-users/get-users.use-case';
import { IncreaseAmountOfVideosUseCase } from '@users/application/increase-amount-of-videos/increase-amount-of-videos.use-case';
import { SQSEventUserCreatedConsumer } from '@users/infrastructure/broker/consumers/sqs-event-user-created.consumer';
import { SQSEventVideoCreatedConsumer } from '@users/infrastructure/broker/consumers/sqs-event-video-created.consumer';
import { EventBridgeUserEventProducer } from '@users/infrastructure/broker/producer/event-bridge-user-event.producer';
import { CreateUserController } from '@users/infrastructure/controllers/create-user/create-user.controller';
import { GetUsersController } from '@users/infrastructure/controllers/get-users/get-users.controller';
import { USER_TOKEN } from '@users/infrastructure/di/user.tokens';
import { CreateUserCommandHandler } from '@users/infrastructure/handlers/command/create-user.command-handler';
import { IncreaseAmountOfVideosHandler } from '@users/infrastructure/handlers/domain/increase-amount-of-videos.handler';
import { UserCreatedHandler } from '@users/infrastructure/handlers/domain/user-created.handler';
import { GetUsersQueryHandler } from '@users/infrastructure/handlers/query/get-users.query-handler';
import { PostgresUserDB } from '@users/infrastructure/persistence/sequelize-user.db';
import { SequelizeUserRepository } from '@users/infrastructure/repositories/sequelize-user.repository';

import { container } from 'tsyringe';

export class DIUsers {
    constructor(private readonly db: PostgresUserDB) {}

    public initDI() {
        this.initDBDependencies();
        this.initControllersDependencies();
        this.initUseCasesDependencies();
        this.initRepositoriesDependencies();
        this.initBrokerDependencies();
        this.initHandlersDependencies();
    }

    public initSingletons() {
        // Publishers and subscribers
        container.resolve(USER_TOKEN.EVENT_BRIDGE_EVENT_PRODUCER);
        container.resolve(USER_TOKEN.SQS_EVENT_USER_CREATED_CONSUMER);
        container.resolve(USER_TOKEN.SQS_EVENT_VIDEO_CREATED_CONSUMER);

        // CQRS Handlers
        container.resolve(USER_TOKEN.CREATE_USER_COMMAND_HANDLER);
        container.resolve(USER_TOKEN.GET_USERS_QUERY_HANDLER);
    }

    private initDBDependencies() {
        container.register(USER_TOKEN.DB_MODEL, {
            useValue: this.db.getUserModel(),
        });
    }

    private initControllersDependencies() {
        container.register(USER_TOKEN.CREATE_USER_CONTROLLER, {
            useClass: CreateUserController,
        });
        container.register(USER_TOKEN.GET_USERS_CONTROLLER, {
            useClass: GetUsersController,
        });
    }

    private initUseCasesDependencies() {
        container.register(USER_TOKEN.INCREASE_AMOUNT_OF_VIDEOS_USE_CASE, {
            useClass: IncreaseAmountOfVideosUseCase,
        });
        container.register(USER_TOKEN.CREATE_USER_USE_CASE, {
            useClass: CreateUserUseCase,
        });
        container.register(USER_TOKEN.GET_USERS_USE_CASE, {
            useClass: GetUsersUseCase,
        });
    }

    private initRepositoriesDependencies() {
        container.register(USER_TOKEN.REPOSITORY, {
            useClass: SequelizeUserRepository,
        });
    }

    private initBrokerDependencies() {
        // Event Bridge
        container.register(USER_TOKEN.EVENT_BRIDGE_USER_TOPIC_ARN, {
            useValue: getEnvs().EVENT_BRIDGE_USER_TOPIC_ARN,
        });
        container.register(USER_TOKEN.EVENT_BRIDGE_EVENT_PRODUCER, {
            useClass: EventBridgeUserEventProducer,
        });

        // SQS
        container.register(USER_TOKEN.SQS_USER_CREATED_QUEUE_URL, {
            useValue: getEnvs().SQS_USER_CREATED_QUEUE_URL,
        });
        container.register(USER_TOKEN.SQS_VIDEO_CREATED_QUEUE_URL, {
            useValue: getEnvs().SQS_VIDEO_CREATED_QUEUE_URL,
        });

        // Consumers
        container.register(USER_TOKEN.SQS_EVENT_USER_CREATED_CONSUMER, {
            useClass: SQSEventUserCreatedConsumer,
        });
        container.register(USER_TOKEN.SQS_EVENT_VIDEO_CREATED_CONSUMER, {
            useClass: SQSEventVideoCreatedConsumer,
        });
    }

    private initHandlersDependencies() {
        // CQRS Handlers
        container.register(USER_TOKEN.CREATE_USER_COMMAND_HANDLER, {
            useClass: CreateUserCommandHandler,
        });
        container.register(USER_TOKEN.GET_USERS_QUERY_HANDLER, {
            useClass: GetUsersQueryHandler,
        });

        // Domain Handlers
        container.register(USER_TOKEN.INCREASE_AMOUNT_OF_VIDEOS_HANDLER, {
            useClass: IncreaseAmountOfVideosHandler,
        });
        container.register(USER_TOKEN.USER_CREATED_HANDLER, {
            useClass: UserCreatedHandler,
        });
    }
}
