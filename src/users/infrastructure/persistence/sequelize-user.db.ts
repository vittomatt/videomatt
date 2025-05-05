import { UnexpectedError } from '@shared/domain/errors/unexpected.error';
import { FailOverDomainEventsDBModel } from '@shared/infrastructure/models/failover-domain-events.db-model';
import { UserDBModel } from '@users/infrastructure/models/user.db-model';

import { Sequelize } from 'sequelize';

export class PostgresUserDB {
    private readonly instance: Sequelize;
    private userModel!: typeof UserDBModel;

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
        this.userModel = UserDBModel.initModel(this.instance);
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

    public getUserModel(): typeof UserDBModel {
        if (!this.userModel) {
            throw new UnexpectedError('User model not initialized');
        }
        return this.userModel;
    }
}
