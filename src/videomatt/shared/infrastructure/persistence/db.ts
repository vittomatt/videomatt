import { VideoCommentDBModel } from '@videomatt/videos/video-comment/infrastructure/models/video-comment.db-model';
import { VideoDBModelRead } from '@videomatt/videos/videos/infrastructure/models/video.db-read-model';
import { VideoDBModel } from '@videomatt/videos/videos/infrastructure/models/video.db-model';
import { UserDBModel } from '@videomatt/users/infrastructure/models/user.db-model';
import { Sequelize } from 'sequelize';

export interface DB {
    initDB(): void;
    syncDB(): Promise<void>;
    getDB(): Sequelize;
    closeDB(): void;
}

export interface DBModel {
    getVideoModel(): typeof VideoDBModel;
    getVideoModelRead(): typeof VideoDBModelRead;
    getVideoCommentModel(): typeof VideoCommentDBModel;
    getUserModel(): typeof UserDBModel;
}
