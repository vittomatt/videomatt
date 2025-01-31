import { IncreaseAmountOfVideosOnVideoPublishedHandler } from '@videomatt/users/infrastructure/handlers/increase-amount-of-videos-on-video-published.handler';
import { IncreaseAmountOfVideosUseCase } from '@videomatt/users/application/increase-amount-of-videos.use-case';
import { CreateUserController } from '@videomatt/users/infrastructure/controllers/create-user.controller';
import { SNSUserEventPublisher } from '@videomatt/users/infrastructure/broker/sns-user-event.publisher';
import { DBUserRepository } from '@videomatt/users/infrastructure/repositories/db-user.repository';
import { CreateUserUseCase } from '@videomatt/users/application/create-user.user-case';
import { DBModel } from '@videomatt/shared/infrastructure/persistence/db';
import { getEnvs } from '@videomatt/shared/envs/init-envs';
import { TOKEN } from './tokens-user';
import { container } from 'tsyringe';

export class DIUsers {
    constructor(private readonly db: DBModel) {}

    public initDi() {
        this.initDBDependencies();
        this.initControllersDependencies();
        this.initUseCasesDependencies();
        this.initHandlersDependencies();
        this.initBrokerDependencies();
        this.initRepositoriesDependencies();
    }

    private initDBDependencies() {
        container.register(TOKEN.DB_MODEL, {
            useValue: this.db.getUserModel(),
        });
    }

    private initControllersDependencies() {
        container.register(TOKEN.CREATE_USER_CONTROLLER, {
            useClass: CreateUserController,
        });
    }

    private initUseCasesDependencies() {
        container.register(TOKEN.INCREASE_AMOUNT_OF_VIDEOS_USE_CASE, {
            useClass: IncreaseAmountOfVideosUseCase,
        });
        container.register(TOKEN.CREATE_USER_USE_CASE, {
            useClass: CreateUserUseCase,
        });
    }

    private initBrokerDependencies() {
        container.register(TOKEN.SNS_TOPIC_ARN, {
            useValue: getEnvs().SNS_USER_TOPIC_ARN,
        });
        container.register(TOKEN.SNS_EVENT_PUBLISHER, {
            useClass: SNSUserEventPublisher,
        });
        container.register(TOKEN.SQS_USER_CREATED_QUEUE_URL, {
            useValue: getEnvs().SQS_USER_CREATED_QUEUE_URL,
        });
    }

    private initRepositoriesDependencies() {
        container.register(TOKEN.REPOSITORY, {
            useClass: DBUserRepository,
        });
    }

    private initHandlersDependencies() {
        container.register(TOKEN.INCREASE_AMOUNT_OF_VIDEOS_ON_VIDEO_PUBLISHED_HANDLER, {
            useClass: IncreaseAmountOfVideosOnVideoPublishedHandler,
        });
    }
}
