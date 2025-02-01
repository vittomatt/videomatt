import { IncreaseAmountOfVideosOnVideoPublishedHandler } from '@videomatt/users/infrastructure/handlers/increase-amount-of-videos-on-video-published.handler';
import { IncreaseAmountOfVideosUseCase } from '@videomatt/users/application/increase-amount-of-videos/increase-amount-of-videos.use-case';
import { SequelizeUserRepository } from '@videomatt/users/infrastructure/repositories/sequelize-user.repository';
import { CreateUserController } from '@videomatt/users/infrastructure/controllers/create-user.controller';
import { SNSUserEventPublisher } from '@videomatt/users/infrastructure/broker/sns-user-event.publisher';
import { CreateUserUseCase } from '@videomatt/users/application/create-user/create-user.use-case';
import { DBModel } from '@videomatt/shared/infrastructure/persistence/db';
import { getEnvs } from '@videomatt/shared/infrastructure/envs/init-envs';
import { USER_TOKENS } from './tokens-user';
import { container } from 'tsyringe';

export class DIUsers {
    constructor(private readonly db: DBModel) {}

    public initDI() {
        this.initDBDependencies();
        this.initControllersDependencies();
        this.initUseCasesDependencies();
        this.initHandlersDependencies();
        this.initBrokerDependencies();
        this.initRepositoriesDependencies();
    }

    private initDBDependencies() {
        container.register(USER_TOKENS.DB_MODEL, {
            useValue: this.db.getUserModel(),
        });
    }

    private initControllersDependencies() {
        container.register(USER_TOKENS.CREATE_USER_CONTROLLER, {
            useClass: CreateUserController,
        });
    }

    private initUseCasesDependencies() {
        container.register(USER_TOKENS.INCREASE_AMOUNT_OF_VIDEOS_USE_CASE, {
            useClass: IncreaseAmountOfVideosUseCase,
        });
        container.register(USER_TOKENS.CREATE_USER_USE_CASE, {
            useClass: CreateUserUseCase,
        });
    }

    private initBrokerDependencies() {
        container.register(USER_TOKENS.SNS_TOPIC_ARN, {
            useValue: getEnvs().SNS_USER_TOPIC_ARN,
        });
        container.register(USER_TOKENS.SNS_EVENT_PUBLISHER, {
            useClass: SNSUserEventPublisher,
        });
        container.register(USER_TOKENS.SQS_USER_CREATED_QUEUE_URL, {
            useValue: getEnvs().SQS_USER_CREATED_QUEUE_URL,
        });
    }

    private initRepositoriesDependencies() {
        container.register(USER_TOKENS.REPOSITORY, {
            useClass: SequelizeUserRepository,
        });
    }

    private initHandlersDependencies() {
        container.register(USER_TOKENS.INCREASE_AMOUNT_OF_VIDEOS_ON_VIDEO_PUBLISHED_HANDLER, {
            useClass: IncreaseAmountOfVideosOnVideoPublishedHandler,
        });
    }
}
