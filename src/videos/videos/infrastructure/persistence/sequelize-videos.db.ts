import { FailOverDomainEventsDBModel } from '@shared/infrastructure/models/failover-domain-events.db-model';
import { VideoCommentDBModel } from '@videos/video-comment/infrastructure/models/video-comment.db-model';
import { VideoDBModel } from '@videos/videos/infrastructure/models/video.db-model';
import { VideoDBModelRead } from '@videos/videos/infrastructure/models/video.db-read-model';

import { Sequelize } from 'sequelize';

export class PostgresVideosDB {
    private readonly instance: Sequelize;
    private videoModel!: typeof VideoDBModel;
    private videoCommentModel!: typeof VideoCommentDBModel;
    private videoModelRead!: typeof VideoDBModelRead;

    constructor({
        dbHost,
        dbUser,
        dbPassword,
        dbName,
        dbPort,
        dbReplicaHost,
        dbReplicaUser,
        dbReplicaPassword,
        dbReplicaName,
        dbReplicaPort,
    }: {
        dbHost: string;
        dbUser: string;
        dbPassword: string;
        dbName: string;
        dbPort: number;
        dbReplicaHost: string;
        dbReplicaUser: string;
        dbReplicaPassword: string;
        dbReplicaName: string;
        dbReplicaPort: number;
    }) {
        this.instance = new Sequelize(dbName, dbUser, dbPassword, {
            replication: {
                write: {
                    host: dbHost,
                    port: dbPort,
                    database: dbName,
                    username: dbUser,
                    password: dbPassword,
                },
                read: [
                    {
                        host: dbReplicaHost,
                        port: dbReplicaPort,
                        database: dbReplicaName,
                        username: dbReplicaUser,
                        password: dbReplicaPassword,
                    },
                ],
            },
            dialect: 'postgres',
            logging: true,
            dialectOptions: {
                connectTimeout: 10000,
            },
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000,
            },
        });
    }

    public initDB() {
        this.initModels();
        this.initAssociations();
    }

    private initModels() {
        this.videoModel = VideoDBModel.initModel(this.instance);
        this.videoCommentModel = VideoCommentDBModel.initModel(this.instance);
        this.videoModelRead = VideoDBModelRead.initModel(this.instance);
        FailOverDomainEventsDBModel.initModel(this.instance);
    }

    private initAssociations() {
        this.videoModel.associate(this);
        this.videoCommentModel.associate(this);
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
