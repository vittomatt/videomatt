import { DBVideo } from '@videomatt/videos/infrastructure/models/db-video';

export interface DB {
    initDb(): void;
    syncDb(): Promise<void>;
    getDb(): DBModel;
    closeDb(): void;
}

export interface DBModel {
    getVideoModel(): typeof DBVideo;
}
