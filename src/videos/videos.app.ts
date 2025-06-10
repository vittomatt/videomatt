import { Logger } from '@shared/domain/logger/logger';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { PinoLogger } from '@shared/infrastructure/logger/pino';
import { Worker } from '@shared/worker';
import { getEnvs, initEnvs } from '@videos/videos.envs';
import { swaggerSpec } from '@videos/videos.swagger';
import { DI } from '@videos/videos/infrastructure/di/video.di';
import { MongoVideosCommentDB } from '@videos/videos/infrastructure/persistence/mongoose-video-comment.db';
import { RedisDB } from '@videos/videos/infrastructure/persistence/redis-db';
import { PostgresVideosDB } from '@videos/videos/infrastructure/persistence/sequelize-videos.db';
import { initRoutes } from '@videos/videos/infrastructure/routes/init-routes';

import compression from 'compression';
import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { container } from 'tsyringe';

export class App {
    private readonly expressApp: Express;

    constructor() {
        this.expressApp = express();
    }

    async init(): Promise<{
        logger: Logger;
        db: PostgresVideosDB;
        mongoDB: MongoVideosCommentDB;
        redis: RedisDB;
        worker: Worker;
        app: Express;
    }> {
        try {
            initEnvs();

            // Init middlewares
            this.expressApp.use(express.json());
            this.expressApp.use(
                helmet({ xssFilter: true, noSniff: true, hidePoweredBy: true, frameguard: { action: 'deny' } })
            );
            this.expressApp.use(cors());
            this.expressApp.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
            this.expressApp.use(compression());

            // Init DB
            const envs = getEnvs();
            const {
                VIDEOS_POSTGRES_DB_HOST,
                VIDEOS_POSTGRES_DB_USER,
                VIDEOS_POSTGRES_DB_PASSWORD,
                VIDEOS_POSTGRES_DB_NAME,
                VIDEOS_POSTGRES_DB_PORT,
                VIDEOS_POSTGRES_DB_REPLICA_HOST,
                VIDEOS_COMMENT_MONGO_DB_HOST,
                VIDEOS_COMMENT_MONGO_DB_PORT,
                VIDEOS_COMMENT_MONGO_DB_NAME,
                VIDEOS_COMMENT_MONGO_DB_USER,
                VIDEOS_COMMENT_MONGO_DB_PASSWORD,
            } = envs;
            const db = new PostgresVideosDB({
                dbHost: VIDEOS_POSTGRES_DB_HOST,
                dbUser: VIDEOS_POSTGRES_DB_USER,
                dbPassword: VIDEOS_POSTGRES_DB_PASSWORD,
                dbName: VIDEOS_POSTGRES_DB_NAME,
                dbPort: VIDEOS_POSTGRES_DB_PORT,
                dbReplicaHost: VIDEOS_POSTGRES_DB_REPLICA_HOST,
            });
            await db.initDB();

            const mongoDB = new MongoVideosCommentDB({
                dbHost: VIDEOS_COMMENT_MONGO_DB_HOST,
                dbName: VIDEOS_COMMENT_MONGO_DB_NAME,
                dbPort: VIDEOS_COMMENT_MONGO_DB_PORT,
                dbUser: VIDEOS_COMMENT_MONGO_DB_USER,
                dbPassword: VIDEOS_COMMENT_MONGO_DB_PASSWORD,
            });
            await mongoDB.initDB();

            const redis = new RedisDB();
            await redis.connect();

            // Init DI
            const di = new DI(db, mongoDB, redis);
            di.initDI();

            // Init routes
            const logger = container.resolve<PinoLogger>(TOKEN.LOGGER);
            this.expressApp.use(logger.getInstance());
            initRoutes(this.expressApp);

            // Init workers
            const worker = container.resolve<Worker>(TOKEN.WORKER_VIDEO);
            worker.start().catch((error) => {
                logger.error(`Worker fatal error: ${error}`);
                process.exit(1);
            });

            return { logger, db, mongoDB, redis, worker, app: this.expressApp };
        } catch (error) {
            console.error('❌ Error initializing application:', error);
            process.exit(1);
        }
    }
}
