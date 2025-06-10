import { EventBridgeClient } from '@aws-sdk/client-eventbridge';
import { SNSClient } from '@aws-sdk/client-sns';
import { SQSClient } from '@aws-sdk/client-sqs';
import { fromIni } from '@aws-sdk/credential-provider-ini';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { InMemoryDomainEventBus } from '@shared/infrastructure/event-bus/in-memory-domain.event-bus';
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
        container.registerSingleton(SQSWorker);
    }

    private initSharedDependencies() {
        container.register(TOKEN.LOGGER, {
            useClass: PinoLogger,
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

    private initModules() {
        new DIUsers().initDI();
    }

    public initSingletons() {
        new DIUsers().initSingletons();
    }
}
