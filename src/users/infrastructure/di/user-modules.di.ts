import { SQSEventUserCreatedConsumer } from '@users/infrastructure/broker/consumers/sqs-event-user-created.consumer';
import { SQSEventVideoCreatedConsumer } from '@users/infrastructure/broker/consumers/sqs-event-video-created.consumer';
import { EventBridgeUserEventProducer } from '@users/infrastructure/broker/producer/event-bridge-user-event.producer';
import { USER_TOKEN } from '@users/infrastructure/di/user.tokens';
import { CreateUserCommandHandler } from '@users/infrastructure/handlers/command/create-user.command-handler';
import { GetUsersQueryHandler } from '@users/infrastructure/handlers/query/get-users.query-handler';
import { SequelizeUserRepository } from '@users/infrastructure/repositories/sequelize-user.repository';
import { getEnvs } from '@users/users.envs';

import { container } from 'tsyringe';

export class DIUsers {
    public initDI() {
        this.initRepositoriesDependencies();
        this.initBrokerDependencies();
    }

    public initSingletons() {
        // Publishers and subscribers
        container.resolve(EventBridgeUserEventProducer);
        container.resolve(SQSEventUserCreatedConsumer);
        container.resolve(SQSEventVideoCreatedConsumer);

        // CQRS Handlers
        container.resolve(CreateUserCommandHandler);
        container.resolve(GetUsersQueryHandler);
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

        // SQS
        container.register(USER_TOKEN.SQS_USER_CREATED_QUEUE_URL, {
            useValue: getEnvs().SQS_USER_CREATED_QUEUE_URL,
        });
        container.register(USER_TOKEN.SQS_VIDEO_CREATED_QUEUE_URL, {
            useValue: getEnvs().SQS_VIDEO_CREATED_QUEUE_URL,
        });
    }
}
