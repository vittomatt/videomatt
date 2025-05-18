import { EventBridgeClient } from '@aws-sdk/client-eventbridge';
import { SNSClient } from '@aws-sdk/client-sns';
import { SQSClient } from '@aws-sdk/client-sqs';
import { fromIni } from '@aws-sdk/credential-provider-ini';
import { ErrorController } from '@shared/infrastructure/controllers/error.controller';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { InMemoryCommandEventBus } from '@shared/infrastructure/event-bus/in-memory-command.event-bus';
import { InMemoryDomainEventBus } from '@shared/infrastructure/event-bus/in-memory-domain.event-bus';
import { InMemoryQueryEventBus } from '@shared/infrastructure/event-bus/in-memory-query.event-bus';
import { DomainEventFailover } from '@shared/infrastructure/events/failover-domain-event';
import { PinoLogger } from '@shared/infrastructure/logger/pino';
import { DIUsers } from '@users/infrastructure/di/user-modules.di';
import { ShardingSequelizeUserDB } from '@users/infrastructure/persistence/sharding-sequelize-user.db';
import { getEnvs } from '@users/users.envs';
import { SQSWorker } from '@users/users.worker';

import { container } from 'tsyringe';

export class DI {
    constructor(private readonly ShardingSequelizeUserDB: ShardingSequelizeUserDB) {}

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
            useValue: this.ShardingSequelizeUserDB,
        });
    }

    private initSingletonDependencies() {
        container.registerSingleton(TOKEN.DOMAIN_EVENT_BUS, InMemoryDomainEventBus);
        container.registerSingleton(TOKEN.COMMAND_EVENT_BUS, InMemoryCommandEventBus);
        container.registerSingleton(TOKEN.QUERY_EVENT_BUS, InMemoryQueryEventBus);
        container.registerSingleton(TOKEN.WORKER_USER, SQSWorker);
    }

    private initSharedDependencies() {
        container.register(TOKEN.LOGGER, {
            useClass: PinoLogger,
        });
        container.register(TOKEN.FAILOVER_DOMAIN_EVENTS, {
            useClass: DomainEventFailover,
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
        new DIUsers().initDI();
    }

    public initSingletons() {
        new DIUsers().initSingletons();
    }
}
