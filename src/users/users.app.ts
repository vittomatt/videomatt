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
    private readonly expressApp: Express;

    constructor() {
        this.expressApp = express();
    }

    async init(): Promise<{
        logger: Logger;
        shardingSequelizeUserDB: ShardingSequelizeUserDB;
        redis: RedisDB;
        worker: Worker;
        app: Express;
    }> {
        try {
            initEnvs();

            // Init middlewares
            this.expressApp.use(helmet());
            this.expressApp.use(express.json());
            this.expressApp.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

            const envs = getEnvs();
            const {
                USERS_POSTGRES_DB_SHARD_1_HOST,
                USERS_POSTGRES_DB_SHARD_1_USER,
                USERS_POSTGRES_DB_SHARD_1_PASSWORD,
                USERS_POSTGRES_DB_SHARD_1_NAME,
                USERS_POSTGRES_DB_SHARD_1_PORT,
                USERS_POSTGRES_DB_SHARD_1_SHARD_NAME,
                USERS_POSTGRES_DB_SHARD_2_HOST,
                USERS_POSTGRES_DB_SHARD_2_USER,
                USERS_POSTGRES_DB_SHARD_2_PASSWORD,
                USERS_POSTGRES_DB_SHARD_2_NAME,
                USERS_POSTGRES_DB_SHARD_2_PORT,
                USERS_POSTGRES_DB_SHARD_2_SHARD_NAME,
            } = envs;

            // Init DBs
            const shardingSequelizeUserDB = new ShardingSequelizeUserDB();

            const dbShard1 = new PostgresUserDB({
                dbHost: USERS_POSTGRES_DB_SHARD_1_HOST,
                dbUser: USERS_POSTGRES_DB_SHARD_1_USER,
                dbPassword: USERS_POSTGRES_DB_SHARD_1_PASSWORD,
                dbName: USERS_POSTGRES_DB_SHARD_1_NAME,
                dbPort: USERS_POSTGRES_DB_SHARD_1_PORT,
            });

            const dbShard2 = new PostgresUserDB({
                dbHost: USERS_POSTGRES_DB_SHARD_2_HOST,
                dbUser: USERS_POSTGRES_DB_SHARD_2_USER,
                dbPassword: USERS_POSTGRES_DB_SHARD_2_PASSWORD,
                dbName: USERS_POSTGRES_DB_SHARD_2_NAME,
                dbPort: USERS_POSTGRES_DB_SHARD_2_PORT,
            });

            shardingSequelizeUserDB.addShard(USERS_POSTGRES_DB_SHARD_1_SHARD_NAME, dbShard1);
            shardingSequelizeUserDB.addShard(USERS_POSTGRES_DB_SHARD_2_SHARD_NAME, dbShard2);

            await shardingSequelizeUserDB.initShards();

            const redis = new RedisDB();
            await redis.connect();

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

            return { logger, shardingSequelizeUserDB, redis, worker, app: this.expressApp };
        } catch (error) {
            console.error('❌ Error initializing application:', error);
            process.exit(1);
        }
    }
}
