import 'reflect-metadata';

import { PostgresDB } from '@videomatt/shared/infrastructure/persistence/postgres';
import { initRoutes } from '@videomatt/shared/infrastructure/routes/init-routes';
import { PinoLogger } from '@videomatt/shared/infrastructure/logger/pino';
import { getEnvs, initEnvs } from '@videomatt/shared/envs/init-envs';
import { DI } from '@videomatt/shared/infrastructure/di/di';
import { container } from 'tsyringe';
import express from 'express';
import helmet from 'helmet';

initEnvs();

const app = express();
const port = getEnvs().PORT;

app.use(helmet());
app.use(express.json());

const db = new PostgresDB();
db.initDb();

const di = new DI(db);
di.initDi();

const logger = container.resolve(PinoLogger);
app.use(logger.getInstance());

initRoutes(app);

app.listen(port, async () => {
    await db.syncDb();
    logger.info(`Server running on http://localhost:${port}`);
});
