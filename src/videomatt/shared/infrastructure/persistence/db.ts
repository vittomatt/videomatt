import { Sequelize } from 'sequelize';

import { DBVideo } from '@videomatt/videos/infrastructure/models/db-video';

export interface DB {
    initDb(): void;
    syncDb(): Promise<void>;
    getDb(): Sequelize;
    closeDb(): void;
}

export interface DBModel {
    getVideoModel(): typeof DBVideo;
}
