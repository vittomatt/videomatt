import { Sequelize } from 'sequelize';

import { getEnvs } from '@videomatt/shared/infrastructure/envs/init-envs';
import { UserDBModel } from '@videomatt/users/infrastructure/models/user.db-model';
import { VideoCommentDBModel } from '@videomatt/videos/video-comment/infrastructure/models/video-comment.db-model';
import { VideoDBModel } from '@videomatt/videos/videos/infrastructure/models/video.db-model';
import { VideoDBModelRead } from '@videomatt/videos/videos/infrastructure/models/video.db-read-model';

export class PostgresDB {
    private readonly instance: Sequelize;
    private videoModel!: typeof VideoDBModel;
    private videoCommentModel!: typeof VideoCommentDBModel;
    private userModel!: typeof UserDBModel;
    private videoModelRead!: typeof VideoDBModelRead;

    constructor() {
        const envs = getEnvs();
        const { DB_HOST, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB } = envs;

        this.instance = new Sequelize(POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, {
            host: DB_HOST,
            dialect: 'postgres',
            logging: false,
        });
    }

    public initDB() {
        this.initModels();
        this.initAssociations();
    }

    private initModels() {
        this.videoModel = VideoDBModel.initModel(this.instance);
        this.userModel = UserDBModel.initModel(this.instance);
        this.videoCommentModel = VideoCommentDBModel.initModel(this.instance);
        this.videoModelRead = VideoDBModelRead.initModel(this.instance);
    }

    private initAssociations() {
        this.videoModel.associate(this);
        this.userModel.associate(this);
        this.videoCommentModel.associate(this);
        this.videoModelRead.associate(this);
    }

    public async syncDB() {
        try {
            await this.instance.sync();
            console.log('✅ Database synchronized successfully');
        } catch (error) {
            console.error('❌ Error synchronizing database:', error);
            throw error;
        }
    }

    public getDB(): Sequelize {
        if (!this.instance) {
            throw new Error('Database not initialized');
        }
        return this.instance;
    }

    public async closeDB() {
        if (this.instance) {
            await this.instance.close();
        }
    }

    public getVideoModel(): typeof VideoDBModel {
        if (!this.videoModel) {
            throw new Error('Video model not initialized');
        }
        return this.videoModel;
    }

    public getUserModel(): typeof UserDBModel {
        if (!this.userModel) {
            throw new Error('User model not initialized');
        }
        return this.userModel;
    }

    public getVideoCommentModel(): typeof VideoCommentDBModel {
        if (!this.videoCommentModel) {
            throw new Error('Video comment model not initialized');
        }
        return this.videoCommentModel;
    }

    public getVideoModelRead(): typeof VideoDBModelRead {
        if (!this.videoModelRead) {
            throw new Error('Video model read not initialized');
        }
        return this.videoModelRead;
    }
}
