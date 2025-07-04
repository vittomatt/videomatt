import { Logger } from '@shared/domain/logger/logger';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { PinoLogger } from '@shared/infrastructure/logger/pino';
import { Worker } from '@shared/worker';
import { DI } from '@users/infrastructure/di/user.di';
import { PostgresUserDB } from '@users/infrastructure/persistence/sequelize-user.db';
import { ShardingSequelizeUserDB } from '@users/infrastructure/persistence/sharding-sequelize-user.db';
import { initRoutes } from '@users/infrastructure/routes/init-routes';
import { getEnvs, initEnvs } from '@users/users.envs';
import { swaggerSpec } from '@users/users.swagger';
import { SQSWorker } from '@users/users.worker';

import compression from 'compression';
import cors from 'cors';
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
        worker: Worker;
        app: Express;
    }> {
        try {
            initEnvs();

            // Init middlewares
            this.expressApp.use(express.json());
            this.expressApp.use(
                helmet({ xssFilter: true, noSniff: true, hidePoweredBy: true, frameguard: { action: 'deny' } })
            );
            this.expressApp.use(cors());
            this.expressApp.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
            this.expressApp.use(compression());

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

            // Init DI
            const di = new DI(shardingSequelizeUserDB);
            di.initDI();

            // Init routes
            const logger = container.resolve<PinoLogger>(TOKEN.LOGGER);
            this.expressApp.use(logger.getInstance());
            initRoutes(this.expressApp);

            // Init workers
            const worker = container.resolve<Worker>(SQSWorker);
            worker.start().catch((error) => {
                logger.error(`Worker fatal error: ${error}`);
                process.exit(1);
            });

            return { logger, shardingSequelizeUserDB, worker, app: this.expressApp };
        } catch (error) {
            console.error('❌ Error initializing application:', error);
            process.exit(1);
        }
    }
}
