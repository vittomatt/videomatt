import 'reflect-metadata';

import { getEnvs } from '@shared/infrastructure/envs/init-envs';
import { USER_DB_SHARD_NAMES } from '@users/infrastructure/persistence/sharding-sequelize-user.db';
import { App } from '@users/users.app';

import express from 'express';

const expressApp = express();
const app = new App(expressApp);

const { logger, shardingSequelizeUserDB, redis } = app.init();

const port = getEnvs().USERS_PORT;
const appInstance = app.getInstance();

appInstance.listen(port, async () => {
    for (const shardName of USER_DB_SHARD_NAMES) {
        await shardingSequelizeUserDB.getShard(shardName).syncDB();
    }

    logger.info(`Server running on http://localhost:${port}`);
});

process.on('SIGINT', async () => {
    for (const shardName of USER_DB_SHARD_NAMES) {
        await shardingSequelizeUserDB.getShard(shardName).closeDB();
        logger.info(`Database connection ${shardName} closed due to app termination`);
    }

    await redis.disconnect();
    logger.info('Redis connection closed due to app termination');

    process.exit(0);
});

process.on('SIGTERM', async () => {
    for (const shardName of USER_DB_SHARD_NAMES) {
        await shardingSequelizeUserDB.getShard(shardName).closeDB();
        logger.info(`Database connection ${shardName} closed due to app termination`);
    }

    await redis.disconnect();
    logger.info('Redis connection closed due to app termination');

    process.exit(0);
});
