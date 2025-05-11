import { UnexpectedError } from '@shared/domain/errors/unexpected.error';
import { defineModel as defineFailOverDomainEventsModel } from '@shared/infrastructure/models/failover-domain-events.db-model';
import { defineModel as defineUserModel } from '@users/infrastructure/models/user.db-model';

import { Sequelize } from 'sequelize';

export class PostgresUserDB {
    private readonly instance: Sequelize;
    private userModel!: ReturnType<typeof defineUserModel>;
    private failoverDomainEventsModel!: ReturnType<typeof defineFailOverDomainEventsModel>;

    constructor({
        dbHost,
        dbUser,
        dbPassword,
        dbName,
        dbPort,
    }: {
        dbHost: string;
        dbUser: string;
        dbPassword: string;
        dbName: string;
        dbPort: number;
    }) {
        this.instance = new Sequelize(dbName, dbUser, dbPassword, {
            host: dbHost,
            port: dbPort,
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
        this.userModel = defineUserModel(this.instance);
        this.failoverDomainEventsModel = defineFailOverDomainEventsModel(this.instance);
    }

    private initAssociations() {}

    public async syncDB() {
        console.log(
            `🔄 syncDB() for ${this.instance.config.database} at ${this.instance.config.host}:${this.instance.config.port}`
        );
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

    public getUserModel(): ReturnType<typeof defineUserModel> {
        if (!this.userModel) {
            throw new UnexpectedError('User model not initialized');
        }
        return this.userModel;
    }

    public getFailoverDomainEventsModel(): ReturnType<typeof defineFailOverDomainEventsModel> {
        if (!this.failoverDomainEventsModel) {
            throw new UnexpectedError('Failover domain events model not initialized');
        }
        return this.failoverDomainEventsModel;
    }
}
