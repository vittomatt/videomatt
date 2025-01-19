import { container } from 'tsyringe';
import { SNSClient } from '@aws-sdk/client-sns';

import { DBModel } from '@videomatt/shared/infrastructure/persistence/db';
import { ErrorController } from '@videomatt/shared/infrastructure/controllers/error.controller';
import { PinoLogger } from '@videomatt/shared/infrastructure/logger/pino';
import { InMemoryEventBus } from '@videomatt/shared/infrastructure/event-bus/in-memory-event-bus';
import { DBVideoRepository } from '@videomatt/videos/infrastructure/repositories/db-video.repository';
import { CreateVideoController } from '@videomatt/videos/infrastructure/controllers/create-video/create-video.controller';
import { SNSEventPublisher } from '@videomatt/shared/infrastructure/broker/sns-event-publisher';
import { CreateVideoUseCase } from '@videomatt/videos/application/create-video.use-case';
import { TOKEN } from './tokens';

export class DI {
    constructor(private readonly db: DBModel) {}

    public initDi() {
        container.register(TOKEN.VIDEO_REPOSITORY, {
            useClass: DBVideoRepository,
        });
        container.register(TOKEN.DB_VIDEO, {
            useValue: this.db.getVideoModel(),
        });
        container.register(TOKEN.CREATE_VIDEO_CONTROLLER, {
            useClass: CreateVideoController,
        });
        container.register(TOKEN.ERROR_CONTROLLER, {
            useClass: ErrorController,
        });
        container.register(TOKEN.CREATE_VIDEO_USE_CASE, {
            useClass: CreateVideoUseCase,
        });
        container.register(TOKEN.EVENT_BUS, {
            useClass: InMemoryEventBus,
        });
        container.register(TOKEN.SNS_EVENT_PUBLISHER, {
            useClass: SNSEventPublisher,
        });
        container.register(TOKEN.SNS_CLIENT, {
            useValue: new SNSClient({ region: 'us-east-1' }),
        });
        container.register(TOKEN.LOGGER, {
            useClass: PinoLogger,
        });
    }
}
