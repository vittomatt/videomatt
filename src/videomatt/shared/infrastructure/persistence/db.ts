import { DBVideoComment } from '@videomatt/videos/video-comment/infrastructure/models/db-video-comment.model';
import { DBVideo } from '@videomatt/videos/videos/infrastructure/models/db-video.model';
import { DBUser } from '@videomatt/users/infrastructure/models/db-user.model';

export interface DB {
    initDb(): void;
    syncDb(): Promise<void>;
    getDb(): DBModel;
    closeDb(): void;
}

export interface DBModel {
    getVideoModel(): typeof DBVideo;
    getVideoCommentModel(): typeof DBVideoComment;
    getUserModel(): typeof DBUser;
}
