import { InMemoryCommandEventBus } from '@videomatt/shared/infrastructure/event-bus/in-memory-command.event-bus';
import { InMemoryDomainEventBus } from '@videomatt/shared/infrastructure/event-bus/in-memory-domain.event-bus';
import { InMemoryQueryEventBus } from '@videomatt/shared/infrastructure/event-bus/in-memory-query.event-bus';
import { DIVideoComments } from '@videomatt/videos/video-comment/infrastructure/di/di-video-comment';
import { ErrorController } from '@videomatt/shared/infrastructure/controllers/error.controller';
import { PostgresDB } from '@videomatt/shared/infrastructure/persistence/sequelize-db';
import { RedisDB } from '@videomatt/shared/infrastructure/persistence/redis-db';
import { DIVideos } from '@videomatt/videos/videos/infrastructure/di/di-video';
import { getEnvs } from '@videomatt/shared/infrastructure/envs/init-envs';
import { PinoLogger } from '@videomatt/shared/infrastructure/logger/pino';
import { DIUsers } from '@videomatt/users/infrastructure/di/di-user';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { SNSClient } from '@aws-sdk/client-sns';
import { SQSClient } from '@aws-sdk/client-sqs';
import { SQSWorker } from 'src/workers';
import { container } from 'tsyringe';

export class DI {
    constructor(
        private readonly db: PostgresDB,
        private readonly redis: RedisDB
    ) {}

    public initDI() {
        this.initDBDependencies();
        this.initSharedDependencies();
        this.initBrokerDependencies();
        this.initControllersDependencies();
        this.initModules();
    }

    private initDBDependencies() {
        container.register(TOKEN.DB, {
            useValue: this.db,
        });
        container.register(TOKEN.REDIS, {
            useValue: this.redis,
        });
    }

    private initSharedDependencies() {
        container.register(TOKEN.DOMAIN_EVENT_BUS, {
            useClass: InMemoryDomainEventBus,
        });
        container.register(TOKEN.COMMAND_EVENT_BUS, {
            useClass: InMemoryCommandEventBus,
        });
        container.register(TOKEN.QUERY_EVENT_BUS, {
            useClass: InMemoryQueryEventBus,
        });
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
}
