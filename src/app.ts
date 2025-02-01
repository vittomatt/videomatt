import { PostgresDB } from '@videomatt/shared/infrastructure/persistence/sequelize-db';
import { initRoutes } from '@videomatt/shared/infrastructure/routes/init-routes';
import { initEnvs } from '@videomatt/shared/infrastructure/envs/init-envs';
import { PinoLogger } from '@videomatt/shared/infrastructure/logger/pino';
import { Logger } from '@videomatt/shared/domain/logger/logger';
import { DI } from '@videomatt/shared/infrastructure/di/di';
import express, { Express } from 'express';
import { container } from 'tsyringe';
import helmet from 'helmet';

export class App {
    constructor(private readonly expressApp: Express) {}

    init(): { logger: Logger; db: PostgresDB } {
        initEnvs();

        this.expressApp.use(helmet());
        this.expressApp.use(express.json());

        const db = new PostgresDB();
        db.initDB();

        const di = new DI(db);
        di.initDI();

        const logger = container.resolve(PinoLogger);
        this.expressApp.use(logger.getInstance());

        initRoutes(this.expressApp);

        return { logger, db };
    }

    getInstance(): Express {
        return this.expressApp;
    }
}
