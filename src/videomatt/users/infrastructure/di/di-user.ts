import { IncreaseAmountOfVideosUseCase } from '@videomatt/users/application/increase-amount-of-videos/increase-amount-of-videos.use-case';
import { IncreaseAmountOfVideosHandler } from '@videomatt/users/infrastructure/handlers/domain/increase-amount-of-videos.handler';
import { SQSEventUserCreatedConsumer } from '@videomatt/users/infrastructure/broker/consumers/sqs-event-user-created.consumer';
import { SequelizeUserRepository } from '@videomatt/users/infrastructure/repositories/sequelize-user.repository';
import { SNSUserEventProducer } from '@videomatt/users/infrastructure/broker/producer/sns-user-event.producer';
import { CreateUserController } from '@videomatt/users/infrastructure/controllers/create-user.controller';
import { CreateUserHandler } from '@videomatt/users/infrastructure/handlers/command/create-user.handler';
import { CreateUserUseCase } from '@videomatt/users/application/create-user/create-user.use-case';
import { PostgresDB } from '@videomatt/shared/infrastructure/persistence/sequelize-db';
import { USER_TOKEN } from '@videomatt/users/infrastructure/di/tokens-user';
import { getEnvs } from '@videomatt/shared/infrastructure/envs/init-envs';
import { container } from 'tsyringe';

export class DIUsers {
    constructor(private readonly db: PostgresDB) {}

    public initDI() {
        this.initDBDependencies();
        this.initControllersDependencies();
        this.initUseCasesDependencies();
        this.initRepositoriesDependencies();
        this.initBrokerDependencies();
        this.initHandlersDependencies();
    }

    public initSingletons() {
        container.resolve(USER_TOKEN.SNS_EVENT_PRODUCER);
        container.resolve(USER_TOKEN.CREATE_USER_HANDLER);
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
    }

    private initUseCasesDependencies() {
        container.register(USER_TOKEN.INCREASE_AMOUNT_OF_VIDEOS_USE_CASE, {
            useClass: IncreaseAmountOfVideosUseCase,
        });
        container.register(USER_TOKEN.CREATE_USER_USE_CASE, {
            useClass: CreateUserUseCase,
        });
    }

    private initRepositoriesDependencies() {
        container.register(USER_TOKEN.REPOSITORY, {
            useClass: SequelizeUserRepository,
        });
    }

    private initBrokerDependencies() {
        // SNS
        container.register(USER_TOKEN.SNS_TOPIC_ARN, {
            useValue: getEnvs().SNS_USER_TOPIC_ARN,
        });
        container.register(USER_TOKEN.SNS_EVENT_PRODUCER, {
            useClass: SNSUserEventProducer,
        });

        // SQS
        container.register(USER_TOKEN.SQS_USER_CREATED_QUEUE_URL, {
            useValue: getEnvs().SQS_USER_CREATED_QUEUE_URL,
        });

        // Consumers
        container.register(USER_TOKEN.SQS_EVENT_USER_CREATED_CONSUMER, {
            useClass: SQSEventUserCreatedConsumer,
        });
    }

    private initHandlersDependencies() {
        container.register(USER_TOKEN.CREATE_USER_HANDLER, {
            useClass: CreateUserHandler,
        });
        container.register(USER_TOKEN.INCREASE_AMOUNT_OF_VIDEOS_HANDLER, {
            useClass: IncreaseAmountOfVideosHandler,
        });
    }
}
