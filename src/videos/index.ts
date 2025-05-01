import 'reflect-metadata';

import { getEnvs } from '@shared/infrastructure/envs/init-envs';
import { App } from '@videos/videos.app';

import express from 'express';

const expressApp = express();
const app = new App(expressApp);

const { logger, db, redis } = app.init();

const port = getEnvs().VIDEOS_PORT;
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
