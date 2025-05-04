import { Logger } from '@shared/domain/logger/logger';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { getEnvs, initEnvs } from '@shared/infrastructure/envs/init-envs';
import { PinoLogger } from '@shared/infrastructure/logger/pino';
import { RedisDB } from '@shared/infrastructure/persistence/redis-db';
import { Worker } from '@shared/worker';
import { DI } from '@users/infrastructure/di/di-user';
import { PostgresUserDB } from '@users/infrastructure/persistence/sequelize-user.db';
import { initRoutes } from '@users/infrastructure/routes/init-routes';

import express, { Express } from 'express';
import helmet from 'helmet';
import { container } from 'tsyringe';

export class App {
    constructor(private readonly expressApp: Express) {}

    init(): { logger: Logger; db: PostgresUserDB; redis: RedisDB } {
        initEnvs();

        // Init middlewares
        this.expressApp.use(helmet());
        this.expressApp.use(express.json());

        // Init DB
        const envs = getEnvs();
        const {
            USERS_DB_POSTGRES_HOST,
            USERS_DB_POSTGRES_USER,
            USERS_DB_POSTGRES_PASSWORD,
            USERS_DB_POSTGRES_NAME,
            USERS_DB_POSTGRES_PORT,
            USERS_DB_REPLICA_POSTGRES_HOST,
            USERS_DB_REPLICA_POSTGRES_USER,
            USERS_DB_REPLICA_POSTGRES_PASSWORD,
            USERS_DB_REPLICA_POSTGRES_NAME,
            USERS_DB_REPLICA_POSTGRES_PORT,
        } = envs;
        const db = new PostgresUserDB({
            dbHost: USERS_DB_POSTGRES_HOST,
            dbUser: USERS_DB_POSTGRES_USER,
            dbPassword: USERS_DB_POSTGRES_PASSWORD,
            dbName: USERS_DB_POSTGRES_NAME,
            dbPort: USERS_DB_POSTGRES_PORT,
            dbReplicaHost: USERS_DB_REPLICA_POSTGRES_HOST,
            dbReplicaUser: USERS_DB_REPLICA_POSTGRES_USER,
            dbReplicaPassword: USERS_DB_REPLICA_POSTGRES_PASSWORD,
            dbReplicaName: USERS_DB_REPLICA_POSTGRES_NAME,
            dbReplicaPort: USERS_DB_REPLICA_POSTGRES_PORT,
        });
        db.initDB();

        const redis = new RedisDB();
        redis.connect();

        // Init DI
        const di = new DI(db, redis);
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

        return { logger, db, redis };
    }

    getInstance(): Express {
        return this.expressApp;
    }
}
