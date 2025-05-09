import { Logger } from '@shared/domain/logger/logger';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { getEnvs, initEnvs } from '@shared/infrastructure/envs/init-envs';
import { PinoLogger } from '@shared/infrastructure/logger/pino';
import { RedisDB } from '@shared/infrastructure/persistence/redis-db';
import { Worker } from '@shared/worker';
import { DI } from '@users/infrastructure/di/user.di';
import { PostgresUserDB } from '@users/infrastructure/persistence/sequelize-user.db';
import { ShardingSequelizeUserDB } from '@users/infrastructure/persistence/sharding-sequelize-user.db';
import { initRoutes } from '@users/infrastructure/routes/init-routes';
import { swaggerSpec } from '@users/users.swagger';

import express, { Express } from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { container } from 'tsyringe';

export class App {
    constructor(private readonly expressApp: Express) {}

    init(): {
        logger: Logger;
        shardingSequelizeUserDB: ShardingSequelizeUserDB;
        redis: RedisDB;
    } {
        initEnvs();

        // Init middlewares
        this.expressApp.use(helmet());
        this.expressApp.use(express.json());
        this.expressApp.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

        // Init DBs
        const envs = getEnvs();
        const {
            USERS_POSTGRES_DB_SHARD_1_HOST,
            USERS_POSTGRES_DB_SHARD_1_USER,
            USERS_POSTGRES_DB_SHARD_1_PASSWORD,
            USERS_POSTGRES_DB_SHARD_1_NAME,
            USERS_POSTGRES_DB_SHARD_1_PORT,
        } = envs;
        const dbShard1 = new PostgresUserDB({
            dbHost: USERS_POSTGRES_DB_SHARD_1_HOST,
            dbUser: USERS_POSTGRES_DB_SHARD_1_USER,
            dbPassword: USERS_POSTGRES_DB_SHARD_1_PASSWORD,
            dbName: USERS_POSTGRES_DB_SHARD_1_NAME,
            dbPort: USERS_POSTGRES_DB_SHARD_1_PORT,
        });
        dbShard1.initDB();

        const {
            USERS_POSTGRES_DB_SHARD_2_HOST,
            USERS_POSTGRES_DB_SHARD_2_USER,
            USERS_POSTGRES_DB_SHARD_2_PASSWORD,
            USERS_POSTGRES_DB_SHARD_2_NAME,
            USERS_POSTGRES_DB_SHARD_2_PORT,
        } = envs;
        const dbShard2 = new PostgresUserDB({
            dbHost: USERS_POSTGRES_DB_SHARD_2_HOST,
            dbUser: USERS_POSTGRES_DB_SHARD_2_USER,
            dbPassword: USERS_POSTGRES_DB_SHARD_2_PASSWORD,
            dbName: USERS_POSTGRES_DB_SHARD_2_NAME,
            dbPort: USERS_POSTGRES_DB_SHARD_2_PORT,
        });
        dbShard2.initDB();

        const shardingSequelizeUserDB = new ShardingSequelizeUserDB(dbShard1, dbShard2);

        const redis = new RedisDB();
        redis.connect();

        // Init DI
        const di = new DI(shardingSequelizeUserDB, redis);
        di.initDI();

        // Init routes
        const logger = container.resolve<PinoLogger>(TOKEN.LOGGER);
        this.expressApp.use(logger.getInstance());
        initRoutes(this.expressApp);

        // Init workers
        const worker = container.resolve<Worker>(TOKEN.WORKER_USER);
        worker.start().catch((error) => {
            logger.error(`Worker fatal error: ${error}`);
            process.exit(1);
        });

        return { logger, shardingSequelizeUserDB, redis };
    }

    getInstance(): Express {
        return this.expressApp;
    }
}
