import { PostgresDB } from '@videomatt/shared/infrastructure/persistence/sequelize-db';
import { initRoutes } from '@videomatt/shared/infrastructure/routes/init-routes';
import { RedisDB } from '@videomatt/shared/infrastructure/persistence/redis-db';
import { initEnvs } from '@videomatt/shared/infrastructure/envs/init-envs';
import { PinoLogger } from '@videomatt/shared/infrastructure/logger/pino';
import { Logger } from '@videomatt/shared/domain/logger/logger';
import { DI } from '@videomatt/shared/infrastructure/di/di';
import express, { Express } from 'express';
import { SQSWorker } from 'src/workers';
import { container } from 'tsyringe';
import helmet from 'helmet';

export class App {
    constructor(private readonly expressApp: Express) {}

    init(): { logger: Logger; db: PostgresDB; redis: RedisDB } {
        initEnvs();

        // Init middlewares
        this.expressApp.use(helmet());
        this.expressApp.use(express.json());

        // Init DB
        const db = new PostgresDB();
        db.initDB();

        const redis = new RedisDB();
        redis.connect();

        // Init DI
        const di = new DI(db, redis);
        di.initDI();

        // Init routes
        const logger = container.resolve(PinoLogger);
        this.expressApp.use(logger.getInstance());
        initRoutes(this.expressApp);

        // Init workers
        const worker = container.resolve(SQSWorker);
        worker.start();

        return { logger, db, redis };
    }

    getInstance(): Express {
        return this.expressApp;
    }
}
