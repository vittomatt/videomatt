import { IncreaseAmountOfVideosUseCase } from '@videomatt/users/application/increase-amount-of-videos/increase-amount-of-videos.use-case';
import { CreateVideoReadHandler } from '@videomatt/videos/videos/infrastructure/handlers/domain/create-video-read.handler';
import { SequelizeUserRepository } from '@videomatt/users/infrastructure/repositories/sequelize-user.repository';
import { CreateUserController } from '@videomatt/users/infrastructure/controllers/create-user.controller';
import { CreateUserHandler } from '@videomatt/users/infrastructure/handlers/command/create-user.handler';
import { SNSUserEventPublisher } from '@videomatt/users/infrastructure/broker/sns-user-event.publisher';
import { CreateUserUseCase } from '@videomatt/users/application/create-user/create-user.use-case';
import { DBModel } from '@videomatt/shared/infrastructure/persistence/db';
import { getEnvs } from '@videomatt/shared/infrastructure/envs/init-envs';
import { USER_TOKEN } from './tokens-user';
import { container } from 'tsyringe';

export class DIUsers {
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
        container.register(USER_TOKEN.SNS_EVENT_PUBLISHER, {
            useClass: SNSUserEventPublisher,
        });

        // SQS
        container.register(USER_TOKEN.SQS_USER_CREATED_QUEUE_URL, {
            useValue: getEnvs().SQS_USER_CREATED_QUEUE_URL,
        });

        // Consumers
    }

    private initHandlersDependencies() {
        container.register(USER_TOKEN.CREATE_USER_HANDLER, {
            useClass: CreateUserHandler,
        });
        container.register(USER_TOKEN.CREATE_VIDEO_READ_HANDLER, {
            useClass: CreateVideoReadHandler,
        });
    }
}
