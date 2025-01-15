import { Sequelize } from 'sequelize';

import { getEnvs } from '@config/init-envs';

import { initModels } from './init-models';

export class DB {
    private sequelize: Sequelize;

    constructor() {
        const envs = getEnvs();
        const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = envs;

        this.sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
            host: DB_HOST,
            dialect: 'postgres',
        });
    }

    public initDb() {
        initModels(this.sequelize);
    }

    public getDb() {
        if (!this.sequelize) {
            throw new Error('Database not initialized');
        }
        return this.sequelize;
    }

    public async closeDb() {
        if (this.sequelize) {
            await this.sequelize.close();
        }
    }
}
