import 'reflect-metadata';

import { Logger } from '@shared/domain/logger/logger';
import { getEnvs } from '@shared/infrastructure/envs/init-envs';
import { RedisDB } from '@shared/infrastructure/persistence/redis-db';
import { Worker } from '@shared/worker';
import { ShardingSequelizeUserDB } from '@users/infrastructure/persistence/sharding-sequelize-user.db';
import { App } from '@users/users.app';

async function bootstrap() {
    const videomattUsersApp = new App();
    const { logger, shardingSequelizeUserDB, redis, worker, app } = await videomattUsersApp.init();

    const port = getEnvs().USERS_PORT;

    const allShards = shardingSequelizeUserDB.getAllShards();
    for (const shard of allShards) {
        await shard.syncDB();
    }

    app.listen(port, () => {
        logger.info(`🚀 Server running on http://localhost:${port}`);
    });

    process.on('SIGINT', async () => {
        await closeInstances(shardingSequelizeUserDB, redis, worker, logger);
    });

    process.on('SIGTERM', async () => {
        await closeInstances(shardingSequelizeUserDB, redis, worker, logger);
    });
}

async function closeInstances(shards: ShardingSequelizeUserDB, redis: RedisDB, worker: Worker, logger: Logger) {
    for (const shard of shards.getAllShards()) {
        await shard.closeDB();
        logger.info(`🛑 Database connection closed`);
    }

    worker.stop();

    await redis.disconnect();
    logger.info('🛑 Redis connection closed');

    process.exit(0);
}

bootstrap().catch((err) => {
    console.error('❌ Fatal bootstrap error:', err);
    process.exit(1);
});
