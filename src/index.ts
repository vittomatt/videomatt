import 'reflect-metadata';

import express from 'express';
import { App } from 'src/app';

import { getEnvs } from '@videomatt/shared/infrastructure/envs/init-envs';

const expressApp = express();
const app = new App(expressApp);

const { logger, db, redis } = app.init();

const port = getEnvs().PORT;
const appInstance = app.getInstance();

appInstance.listen(port, async () => {
    await db.syncDB();
    logger.info(`Server running on http://localhost:${port}`);
});

process.on('SIGINT', async () => {
    await db.closeDB();
    logger.info('Database connection closed due to app termination');

    await redis.disconnect();
    logger.info('Redis connection closed due to app termination');

    process.exit(0);
});

process.on('SIGTERM', async () => {
    await db.closeDB();
    logger.info('Database connection closed due to app termination');

    await redis.disconnect();
    logger.info('Redis connection closed due to app termination');

    process.exit(0);
});
