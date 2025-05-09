import { UnexpectedError } from '@shared/domain/errors/unexpected.error';
import { FailOverDomainEventsDBModel } from '@shared/infrastructure/models/failover-domain-events.db-model';
import { VideoWithAmountOfCommentsDBModel } from '@videos/videos/infrastructure/models/video-with-amount-of-comments.db-model';
import { VideoDBModel } from '@videos/videos/infrastructure/models/video.db-model';

import { Sequelize } from 'sequelize';

export class PostgresVideosDB {
    private readonly instance: Sequelize;
    private videoModel!: typeof VideoDBModel;
    private videoWithAmountOfCommentsModel!: typeof VideoWithAmountOfCommentsDBModel;

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
        this.videoWithAmountOfCommentsModel = VideoWithAmountOfCommentsDBModel.initModel(this.instance);
        FailOverDomainEventsDBModel.initModel(this.instance);
    }

    private initAssociations() {}

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
            throw new UnexpectedError('Database not initialized');
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
            throw new UnexpectedError('Video model not initialized');
        }
        return this.videoModel;
    }

    public getVideoWihtAmountOfCommentModel(): typeof VideoWithAmountOfCommentsDBModel {
        if (!this.videoWithAmountOfCommentsModel) {
            throw new UnexpectedError('Video model read not initialized');
        }
        return this.videoWithAmountOfCommentsModel;
    }
}
