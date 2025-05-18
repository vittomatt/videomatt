import 'reflect-metadata';

import { Logger } from '@shared/domain/logger/logger';
import { Worker } from '@shared/worker';
import { ShardingSequelizeUserDB } from '@users/infrastructure/persistence/sharding-sequelize-user.db';
import { App } from '@users/users.app';
import { getEnvs } from '@users/users.envs';

async function bootstrap() {
    const videomattUsersApp = new App();
    const { logger, shardingSequelizeUserDB, worker, app } = await videomattUsersApp.init();

    const port = getEnvs().USERS_PORT;

    const allShards = shardingSequelizeUserDB.getAllShards();
    for (const shard of allShards) {
        await shard.syncDB();
    }

    app.listen(port, () => {
        logger.info(`🚀 Server running on http://localhost:${port}`);
    });

    process.on('SIGINT', async () => {
        await closeInstances(shardingSequelizeUserDB, worker, logger);
    });

    process.on('SIGTERM', async () => {
        await closeInstances(shardingSequelizeUserDB, worker, logger);
    });
}

async function closeInstances(shards: ShardingSequelizeUserDB, worker: Worker, logger: Logger) {
    for (const shard of shards.getAllShards()) {
        await shard.closeDB();
        logger.info(`🛑 Database connection closed`);
    }

    worker.stop();

    process.exit(0);
}

bootstrap().catch((err) => {
    console.error('❌ Fatal bootstrap error:', err);
    process.exit(1);
});
