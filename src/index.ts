import 'reflect-metadata';

import express from 'express';
import helmet from 'helmet';
import { container } from 'tsyringe';

import { getEnvs, initEnvs } from '@videomatt/shared/envs/init-envs';
import { DI } from '@videomatt/shared/infrastructure/di/di';
import { PostgresDB } from '@videomatt/shared/infrastructure/persistence/postgres';
import { VideoRoutes } from '@videomatt/videos/infrastructure/routes/video.routes';
import { ErrorController } from '@videomatt/shared/infrastructure/controllers/error.controller';
import { PinoLogger } from '@videomatt/shared/infrastructure/logger/pino';

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

// Routes
const videoRoutes = container.resolve(VideoRoutes);
videoRoutes.initRoutes(app);

const errorController = container.resolve(ErrorController);
app.use(errorController.execute.bind(errorController));

app.listen(port, async () => {
    await db.syncDb();
    logger.info(`Server running on http://localhost:${port}`);
});
