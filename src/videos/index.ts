import 'reflect-metadata';

import { Logger } from '@shared/domain/logger/logger';
import { getEnvs } from '@shared/infrastructure/envs/init-envs';
import { RedisDB } from '@shared/infrastructure/persistence/redis-db';
import { Worker } from '@shared/worker';
import { App } from '@videos/videos.app';
import { PostgresVideosDB } from '@videos/videos/infrastructure/persistence/sequelize-videos.db';

async function bootstrap() {
    const videomattVideosApp = new App();
    const { logger, db, redis, worker, app } = await videomattVideosApp.init();

    const port = getEnvs().VIDEOS_PORT;

    await db.syncDB();

    app.listen(port, () => {
        logger.info(`🚀 Server running on http://localhost:${port}`);
    });

    process.on('SIGINT', async () => {
        await closeInstances(db, redis, worker, logger);
    });

    process.on('SIGTERM', async () => {
        await closeInstances(db, redis, worker, logger);
    });
}

async function closeInstances(db: PostgresVideosDB, redis: RedisDB, worker: Worker, logger: Logger) {
    await db.closeDB();
    logger.info(`🛑 Database connection closed`);

    worker.stop();

    await redis.disconnect();
    logger.info('🛑 Redis connection closed');

    process.exit(0);
}

bootstrap().catch((err) => {
    console.error('❌ Fatal bootstrap error:', err);
    process.exit(1);
});
