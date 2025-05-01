import { Logger } from '@shared/domain/logger/logger';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { getEnvs, initEnvs } from '@shared/infrastructure/envs/init-envs';
import { PinoLogger } from '@shared/infrastructure/logger/pino';
import { RedisDB } from '@shared/infrastructure/persistence/redis-db';
import { Worker } from '@shared/worker';
import { DI } from '@videos/videos/infrastructure/di/di-video';
import { PostgresVideosDB } from '@videos/videos/infrastructure/persistence/sequelize-videos.db';
import { initRoutes } from '@videos/videos/infrastructure/routes/init-routes';

import express, { Express } from 'express';
import helmet from 'helmet';
import { container } from 'tsyringe';

export class App {
    constructor(private readonly expressApp: Express) {}

    init(): { logger: Logger; db: PostgresVideosDB; redis: RedisDB } {
        initEnvs();

        // Init middlewares
        this.expressApp.use(helmet());
        this.expressApp.use(express.json());

        // Init DB
        const envs = getEnvs();
        const {
            VIDEOS_DB_HOST,
            VIDEOS_POSTGRES_USER,
            VIDEOS_POSTGRES_PASSWORD,
            VIDEOS_POSTGRES_NAME,
            VIDEOS_POSTGRES_PORT,
        } = envs;
        const db = new PostgresVideosDB({
            dbHost: VIDEOS_DB_HOST,
            dbUser: VIDEOS_POSTGRES_USER,
            dbPassword: VIDEOS_POSTGRES_PASSWORD,
            dbName: VIDEOS_POSTGRES_NAME,
            dbPort: VIDEOS_POSTGRES_PORT,
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
        const worker = container.resolve<Worker>(TOKEN.WORKER_VIDEO);
        worker.start();

        return { logger, db, redis };
    }

    getInstance(): Express {
        return this.expressApp;
    }
}
