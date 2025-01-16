import { container } from 'tsyringe';

import { DBVideoRepository } from '@videomatt/videos/infrastructure/repositories/db-video-repository';
import { TOKEN } from './tokens';
import { DBModel } from '../infrastructure/persistence/db';

export class DI {
    constructor(private readonly db: DBModel) {}

    public register() {
        container.register(TOKEN.VIDEO_REPOSITORY, {
            useClass: DBVideoRepository,
        });
        container.register(TOKEN.DB_VIDEO, {
            useValue: this.db.getVideoModel(),
        });
    }
}
