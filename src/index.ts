import 'reflect-metadata';

import { getEnvs } from '@videomatt/shared/infrastructure/envs/init-envs';
import express from 'express';
import { App } from 'src/app';

const expressApp = express();
const app = new App(expressApp);

const { logger, db } = app.init();

const port = getEnvs().PORT;
const appInstance = app.getInstance();

appInstance.listen(port, async () => {
    await db.syncDB();
    logger.info(`Server running on http://localhost:${port}`);
});
