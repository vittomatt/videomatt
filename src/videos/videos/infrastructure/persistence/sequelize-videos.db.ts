import { UnexpectedError } from '@shared/domain/errors/unexpected.error';
import { defineModel as defineFailOverDomainEventsModel } from '@shared/infrastructure/models/failover-domain-events.db-model';
import { VideoProjectionDBModel } from '@videos/videos/infrastructure/models/video-projection.db-model';
import { VideoDBModel } from '@videos/videos/infrastructure/models/video.db-model';

import { Sequelize } from 'sequelize';
import { injectable } from 'tsyringe';

@injectable()
export class PostgresVideosDB {
    private readonly instance: Sequelize;
    private videoModel!: typeof VideoDBModel;
    private videoProjectionModel!: typeof VideoProjectionDBModel;
    private failoverDomainEventsModel!: ReturnType<typeof defineFailOverDomainEventsModel>;

    constructor({
        dbHost,
        dbUser,
        dbPassword,
        dbName,
        dbPort,
        dbReplicaHost,
    }: {
        dbHost: string;
        dbUser: string;
        dbPassword: string;
        dbName: string;
        dbPort: number;
        dbReplicaHost: string;
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
                        port: dbPort,
                        database: dbName,
                        username: dbUser,
                        password: dbPassword,
                    },
                ],
            },
            dialect: 'postgres',
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

    public async initDB() {
        console.log(
            `🧱 initDB() for ${this.instance.config.database} at ${this.instance.config.host}:${this.instance.config.port}`
        );

        await this.instance.authenticate();

        this.initModels();
        this.initAssociations();
    }

    private initModels() {
        console.log(
            `🔄 syncDB() for ${this.instance.config.database} at ${this.instance.config.host}:${this.instance.config.port}`
        );
        this.videoModel = VideoDBModel.initModel(this.instance);
        this.videoProjectionModel = VideoProjectionDBModel.initModel(this.instance);
        this.failoverDomainEventsModel = defineFailOverDomainEventsModel(this.instance);
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

    public getVideoProjectionModel(): typeof VideoProjectionDBModel {
        if (!this.videoProjectionModel) {
            throw new UnexpectedError('Video projection model not initialized');
        }
        return this.videoProjectionModel;
    }

    public getFailoverDomainEventsModel(): ReturnType<typeof defineFailOverDomainEventsModel> {
        if (!this.failoverDomainEventsModel) {
            throw new UnexpectedError('Failover domain events model not initialized');
        }
        return this.failoverDomainEventsModel;
    }
}
