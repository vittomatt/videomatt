import { SNSClient } from '@aws-sdk/client-sns';
import { SQSClient } from '@aws-sdk/client-sqs';

import { container } from 'tsyringe';

import { SQSWorker } from 'src/workers';

import { DomainEventBus } from '@videomatt/shared/domain/event-bus/domain-event-bus';
import { ErrorController } from '@videomatt/shared/infrastructure/controllers/error.controller';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { getEnvs } from '@videomatt/shared/infrastructure/envs/init-envs';
import { InMemoryCommandEventBus } from '@videomatt/shared/infrastructure/event-bus/in-memory-command.event-bus';
import { InMemoryDomainEventBus } from '@videomatt/shared/infrastructure/event-bus/in-memory-domain.event-bus';
import { InMemoryQueryEventBus } from '@videomatt/shared/infrastructure/event-bus/in-memory-query.event-bus';
import { PinoLogger } from '@videomatt/shared/infrastructure/logger/pino';
import { RedisDB } from '@videomatt/shared/infrastructure/persistence/redis-db';
import { PostgresDB } from '@videomatt/shared/infrastructure/persistence/sequelize-db';
import { DIUsers } from '@videomatt/users/infrastructure/di/di-user';
import { DIVideoComments } from '@videomatt/videos/video-comment/infrastructure/di/di-video-comment';
import { DIVideos } from '@videomatt/videos/videos/infrastructure/di/di-video';

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
        const awsRegion = getEnvs().AWS_REGION;
        container.register(TOKEN.WORKER, {
            useClass: SQSWorker,
        });
        container.register(TOKEN.SNS_CLIENT, {
            useValue: new SNSClient({ region: awsRegion }),
        });
        container.register(TOKEN.SQS_CLIENT, {
            useValue: new SQSClient({
                region: awsRegion,
            }),
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
