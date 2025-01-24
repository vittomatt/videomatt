import { Sequelize } from 'sequelize';

import { getEnvs } from '@videomatt/shared/envs/init-envs';
import { DBVideo } from '@videomatt/videos/infrastructure/models/db-video.model';
import { DBUser } from '@videomatt/users/infrastructure/models/db-user.model';

import { DB, DBModel } from './db';

export class PostgresDB implements DB, DBModel {
    private instance: Sequelize;
    private videoModel!: typeof DBVideo;
    private userModel!: typeof DBUser;

    constructor() {
        const envs = getEnvs();
        const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = envs;

        this.instance = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
            host: DB_HOST,
            dialect: 'postgres',
            logging: false,
        });
    }

    public initDb() {
        this.videoModel = DBVideo.initModel(this.instance);
        this.userModel = DBUser.initModel(this.instance);
    }

    public async syncDb() {
        try {
            await this.instance.sync();
            console.log('✅ Database synchronized successfully');
        } catch (error) {
            console.error('❌ Error synchronizing database:', error);
        }
    }

    public getDb(): DBModel {
        if (!this.instance) {
            throw new Error('Database not initialized');
        }
        return this;
    }

    public async closeDb() {
        if (this.instance) {
            await this.instance.close();
        }
    }

    public getVideoModel(): typeof DBVideo {
        if (!this.videoModel) {
            throw new Error('Video model not initialized');
        }
        return this.videoModel;
    }

    public getUserModel(): typeof DBUser {
        if (!this.userModel) {
            throw new Error('User model not initialized');
        }
        return this.userModel;
    }
}
