import { DIVideoComments } from '@videomatt/videos/video-comment/infrastructure/di/di-video-comment';
import { InMemoryEventBus } from '@videomatt/shared/infrastructure/event-bus/in-memory-event-bus';
import { ErrorController } from '@videomatt/shared/infrastructure/controllers/error.controller';
import { PostgresDB } from '@videomatt/shared/infrastructure/persistence/sequelize-db';
import { DIVideos } from '@videomatt/videos/videos/infrastructure/di/di-video';
import { getEnvs } from '@videomatt/shared/infrastructure/envs/init-envs';
import { PinoLogger } from '@videomatt/shared/infrastructure/logger/pino';
import { DIUsers } from '@videomatt/users/infrastructure/di/di-user';
import { SNSClient } from '@aws-sdk/client-sns';
import { SQSClient } from '@aws-sdk/client-sqs';
import { container } from 'tsyringe';
import { TOKEN } from './tokens';

export class DI {
    constructor(private readonly db: PostgresDB) {}

    public initDI() {
        new DIUsers(this.db).initDI();
        new DIVideos(this.db).initDI();
        new DIVideoComments(this.db).initDI();

        this.initDBDependencies();
        this.initSharedDependencies();
        this.initBrokerDependencies();
        this.initControllersDependencies();
    }

    private initDBDependencies() {
        container.register(TOKEN.DB, {
            useValue: this.db as PostgresDB,
        });
    }

    private initSharedDependencies() {
        container.register(TOKEN.EVENT_BUS, {
            useClass: InMemoryEventBus,
        });
        container.register(TOKEN.LOGGER, {
            useClass: PinoLogger,
        });
    }

    private initBrokerDependencies() {
        const awsRegion = getEnvs().AWS_REGION;
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
}
