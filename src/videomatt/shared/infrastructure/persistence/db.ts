import { DBVideo } from '@videomatt/videos/infrastructure/models/db-video.model';
import { DBUser } from '@videomatt/users/infrastructure/models/db-user.model';

export interface DB {
    initDb(): void;
    syncDb(): Promise<void>;
    getDb(): DBModel;
    closeDb(): void;
}

export interface DBModel {
    getVideoModel(): typeof DBVideo;
    getUserModel(): typeof DBUser;
}
