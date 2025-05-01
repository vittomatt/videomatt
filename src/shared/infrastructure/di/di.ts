import { SNSClient } from '@aws-sdk/client-sns';
import { SQSClient } from '@aws-sdk/client-sqs';
import { fromIni } from '@aws-sdk/credential-provider-ini';
import { DomainEventBus } from '@shared/domain/event-bus/domain-event-bus';
import { ErrorController } from '@shared/infrastructure/controllers/error.controller';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { getEnvs } from '@shared/infrastructure/envs/init-envs';
import { InMemoryCommandEventBus } from '@shared/infrastructure/event-bus/in-memory-command.event-bus';
import { InMemoryDomainEventBus } from '@shared/infrastructure/event-bus/in-memory-domain.event-bus';
import { InMemoryQueryEventBus } from '@shared/infrastructure/event-bus/in-memory-query.event-bus';
import { PinoLogger } from '@shared/infrastructure/logger/pino';
import { RedisDB } from '@shared/infrastructure/persistence/redis-db';
import { PostgresDB } from '@shared/infrastructure/persistence/sequelize-db';
import { DIUsers } from '@users/infrastructure/di/di-user';
import { SQSWorker as UserSQSWorker } from '@users/users-worker';
import { DIVideoComments } from '@videos/video-comment/infrastructure/di/di-video-comment';
import { SQSWorker as VideoSQSWorker } from '@videos/videos-worker';
import { DIVideos } from '@videos/videos/infrastructure/di/di-video';

import { container } from 'tsyringe';

export class DI {
    constructor(
        private readonly db: PostgresDB,
        private readonly redis: RedisDB
    ) {}

    public initDI() {
        this.initDBDependencies();
        this.initSingletonDependencies();
        this.initSharedDependencies();
        this.initBrokerDependencies();
        this.initControllersDependencies();
        this.initModules();
        this.initSingletons();
    }

    private initDBDependencies() {
        container.register(TOKEN.DB, {
            useValue: this.db,
        });
        container.register(TOKEN.REDIS, {
            useValue: this.redis,
        });
    }

    private initSingletonDependencies() {
        container.registerSingleton<DomainEventBus>(TOKEN.DOMAIN_EVENT_BUS, InMemoryDomainEventBus);
        container.registerSingleton(TOKEN.COMMAND_EVENT_BUS, InMemoryCommandEventBus);
        container.registerSingleton(TOKEN.QUERY_EVENT_BUS, InMemoryQueryEventBus);
    }

    private initSharedDependencies() {
        container.register(TOKEN.LOGGER, {
            useClass: PinoLogger,
        });
    }

    private initBrokerDependencies() {
        const { AWS_REGION, AWS_PROFILE } = getEnvs();

        const awsConfig = {
            region: AWS_REGION,
            credentials: fromIni({
                profile: AWS_PROFILE,
            }),
        };

        container.register(TOKEN.WORKER_USER, {
            useClass: UserSQSWorker,
        });
        container.register(TOKEN.WORKER_VIDEO, {
            useClass: VideoSQSWorker,
        });
        container.register(TOKEN.SNS_CLIENT, {
            useValue: new SNSClient(awsConfig),
        });
        container.register(TOKEN.SQS_CLIENT, {
            useValue: new SQSClient(awsConfig),
        });
    }

    private initControllersDependencies() {
        container.register(TOKEN.ERROR_CONTROLLER, {
            useClass: ErrorController,
        });
    }

    private initModules() {
        new DIUsers(this.db).initDI();
        new DIVideos(this.db).initDI();
        new DIVideoComments(this.db).initDI();
    }

    public initSingletons() {
        new DIUsers(this.db).initSingletons();
        new DIVideos(this.db).initSingletons();
        new DIVideoComments(this.db).initSingletons();
    }
}
