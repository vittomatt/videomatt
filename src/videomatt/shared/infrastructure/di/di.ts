import { DIVideoComments } from '@videomatt/videos/video-comment/infrastructure/di/di-video-comment';
import { InMemoryEventBus } from '@videomatt/shared/infrastructure/event-bus/in-memory-event-bus';
import { ErrorController } from '@videomatt/shared/infrastructure/controllers/error.controller';
import { DIVideos } from '@videomatt/videos/videos/infrastructure/di/di-video';
import { DBModel } from '@videomatt/shared/infrastructure/persistence/db';
import { PinoLogger } from '@videomatt/shared/infrastructure/logger/pino';
import { DIUsers } from '@videomatt/users/infrastructure/di/di-user';
import { getEnvs } from '@videomatt/shared/envs/init-envs';
import { SNSClient } from '@aws-sdk/client-sns';
import { SQSClient } from '@aws-sdk/client-sqs';
import { container } from 'tsyringe';
import { TOKEN } from './tokens';

export class DI {
    constructor(private readonly db: DBModel) {}

    public initDi() {
        const diUsers = new DIUsers(this.db);
        const diVideos = new DIVideos(this.db);
        const diVideoComments = new DIVideoComments(this.db);

        diUsers.initDi();
        diVideos.initDi();
        diVideoComments.initDi();

        this.initControllersDependencies();
        this.initBrokerDependencies();
        this.initSharedDependencies();
    }

    private initControllersDependencies() {
        container.register(TOKEN.ERROR_CONTROLLER, {
            useClass: ErrorController,
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

    private initSharedDependencies() {
        container.register(TOKEN.EVENT_BUS, {
            useClass: InMemoryEventBus,
        });
        container.register(TOKEN.LOGGER, {
            useClass: PinoLogger,
        });
    }
}
