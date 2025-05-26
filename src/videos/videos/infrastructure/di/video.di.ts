import { EventBridgeClient } from '@aws-sdk/client-eventbridge';
import { SNSClient } from '@aws-sdk/client-sns';
import { SQSClient } from '@aws-sdk/client-sqs';
import { fromIni } from '@aws-sdk/credential-provider-ini';
import { ErrorController } from '@shared/infrastructure/controllers/error.controller';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { InMemoryCommandEventBus } from '@shared/infrastructure/event-bus/in-memory-command.event-bus';
import { InMemoryDeferredDomainEventBus } from '@shared/infrastructure/event-bus/in-memory-deferred-domain.event-bus';
import { InMemoryDomainEventBus } from '@shared/infrastructure/event-bus/in-memory-domain.event-bus';
import { InMemoryQueryEventBus } from '@shared/infrastructure/event-bus/in-memory-query.event-bus';
import { PinoLogger } from '@shared/infrastructure/logger/pino';
import { DIVideoComments } from '@videos/video-comment/infrastructure/di/video-comment.di';
import { getEnvs } from '@videos/videos.envs';
import { SQSWorker } from '@videos/videos.worker';
import { DIVideos } from '@videos/videos/infrastructure/di/video-modules.di';
import { VIDEO_TOKEN } from '@videos/videos/infrastructure/di/video.tokens';
import { VideoDomainEventFailover } from '@videos/videos/infrastructure/events/videos-failover-domain-event';
import { MongoVideosCommentDB } from '@videos/videos/infrastructure/persistence/mongoose-video-comment.db';
import { RedisDB } from '@videos/videos/infrastructure/persistence/redis-db';
import { PostgresVideosDB } from '@videos/videos/infrastructure/persistence/sequelize-videos.db';

import { container } from 'tsyringe';

export class DI {
    constructor(
        private readonly db: PostgresVideosDB,
        private readonly mongoDB: MongoVideosCommentDB,
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
        container.register(VIDEO_TOKEN.REDIS, {
            useValue: this.redis,
        });
        container.register(TOKEN.MONGO_DB, {
            useValue: this.mongoDB,
        });
    }

    private initSingletonDependencies() {
        container.registerSingleton(TOKEN.DOMAIN_EVENT_BUS, InMemoryDomainEventBus);
        container.registerSingleton(TOKEN.DEFERRED_DOMAIN_EVENT_BUS, InMemoryDeferredDomainEventBus);
        container.registerSingleton(TOKEN.COMMAND_EVENT_BUS, InMemoryCommandEventBus);
        container.registerSingleton(TOKEN.QUERY_EVENT_BUS, InMemoryQueryEventBus);
        container.registerSingleton(TOKEN.WORKER_VIDEO, SQSWorker);
    }

    private initSharedDependencies() {
        container.register(TOKEN.LOGGER, {
            useClass: PinoLogger,
        });
        container.register(VIDEO_TOKEN.FAILOVER_DOMAIN_EVENTS, {
            useClass: VideoDomainEventFailover,
        });
    }

    private initBrokerDependencies() {
        const {
            AWS_REGION,
            AWS_PROFILE,
            AWS_ACCESS_KEY_ID,
            AWS_SECRET_ACCESS_KEY,
            AWS_SQS_ENDPOINT,
            AWS_SNS_ENDPOINT,
            AWS_EVENT_BRIDGE_ENDPOINT,
        } = getEnvs();

        if (AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY && AWS_PROFILE) {
            throw new Error('AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_PROFILE cannot be used together');
        }

        const useCredentials = AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY;
        const credentials = useCredentials
            ? {
                  accessKeyId: AWS_ACCESS_KEY_ID,
                  secretAccessKey: AWS_SECRET_ACCESS_KEY,
              }
            : fromIni({
                  profile: AWS_PROFILE,
              });

        const awsConfig = {
            region: AWS_REGION,
            credentials,
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
        new DIVideoComments(this.mongoDB).initDI();
    }

    public initSingletons() {
        new DIVideos(this.db).initSingletons();
        new DIVideoComments(this.mongoDB).initSingletons();
    }
}
