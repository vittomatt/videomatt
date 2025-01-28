import 'reflect-metadata';

import { getEnvs } from '@videomatt/shared/envs/init-envs';
import express from 'express';
import { App } from './app';

const expressApp = express();
const app = new App(expressApp);

const { logger, db } = app.init();

const port = getEnvs().PORT;
const appInstance = app.getInstance();

appInstance.listen(port, async () => {
    await db.syncDb();
    logger.info(`Server running on http://localhost:${port}`);
});
