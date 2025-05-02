import { EventBridgeClient } from '@aws-sdk/client-eventbridge';
import { SNSClient } from '@aws-sdk/client-sns';
import { SQSClient } from '@aws-sdk/client-sqs';
import { fromIni } from '@aws-sdk/credential-provider-ini';
import { ErrorController } from '@shared/infrastructure/controllers/error.controller';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { getEnvs } from '@shared/infrastructure/envs/init-envs';
import { InMemoryCommandEventBus } from '@shared/infrastructure/event-bus/in-memory-command.event-bus';
import { InMemoryDomainEventBus } from '@shared/infrastructure/event-bus/in-memory-domain.event-bus';
import { InMemoryQueryEventBus } from '@shared/infrastructure/event-bus/in-memory-query.event-bus';
import { PinoLogger } from '@shared/infrastructure/logger/pino';
import { RedisDB } from '@shared/infrastructure/persistence/redis-db';
import { DIVideoComments } from '@videos/video-comment/infrastructure/di/di-video-comment';
import { SQSWorker } from '@videos/videos.worker';
import { DIVideos } from '@videos/videos/infrastructure/di/di-video-modules';
import { PostgresVideosDB } from '@videos/videos/infrastructure/persistence/sequelize-videos.db';

import { container } from 'tsyringe';

export class DI {
    constructor(
        private readonly db: PostgresVideosDB,
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
        container.registerSingleton(TOKEN.DOMAIN_EVENT_BUS, InMemoryDomainEventBus);
        container.registerSingleton(TOKEN.COMMAND_EVENT_BUS, InMemoryCommandEventBus);
        container.registerSingleton(TOKEN.QUERY_EVENT_BUS, InMemoryQueryEventBus);
        container.registerSingleton(TOKEN.WORKER_VIDEO, SQSWorker);
    }

    private initSharedDependencies() {
        container.register(TOKEN.LOGGER, {
            useClass: PinoLogger,
        });
    }

    private initBrokerDependencies() {
        const { AWS_REGION, AWS_PROFILE, AWS_SQS_ENDPOINT, AWS_SNS_ENDPOINT, AWS_EVENT_BRIDGE_ENDPOINT } = getEnvs();

        const awsConfig = {
            region: AWS_REGION,
            credentials: fromIni({
                profile: AWS_PROFILE,
            }),
            useQueueUrlAsEndpoint: false,
        };

        container.register(TOKEN.SNS_CLIENT, {
            useValue: new SNSClient({
                ...awsConfig,
                endpoint: AWS_SNS_ENDPOINT,
            }),
        });
        container.register(TOKEN.SQS_CLIENT, {
            useValue: new SQSClient({ ...awsConfig, endpoint: AWS_SQS_ENDPOINT }),
        });
        container.register(TOKEN.EVENT_BRIDGE_CLIENT, {
            useValue: new EventBridgeClient({ ...awsConfig, endpoint: AWS_EVENT_BRIDGE_ENDPOINT }),
        });
    }

    private initControllersDependencies() {
        container.register(TOKEN.ERROR_CONTROLLER, {
            useClass: ErrorController,
        });
    }

    private initModules() {
        new DIVideos(this.db).initDI();
        new DIVideoComments(this.db).initDI();
    }

    public initSingletons() {
        new DIVideos(this.db).initSingletons();
        new DIVideoComments(this.db).initSingletons();
    }
}
