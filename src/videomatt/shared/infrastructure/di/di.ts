import { container } from 'tsyringe';

import { TOKEN } from './tokens';
import { DBModel } from '@videomatt/shared/infrastructure/persistence/db';
import { DBVideoRepository } from '@videomatt/videos/infrastructure/repositories/db-video.repository';
import { CreateVideoController } from '@videomatt/videos/infrastructure/controllers/create-video/create-video.controller';
import { CreateVideoUseCase } from '@videomatt/videos/application/create-video.usecase';

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
        container.register(TOKEN.CREATE_VIDEO_USE_CASE, {
            useClass: CreateVideoUseCase,
        });
    }
}
