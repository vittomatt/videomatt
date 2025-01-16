import 'reflect-metadata';

import express from 'express';
import helmet from 'helmet';
import { container } from 'tsyringe';

import { getEnvs, initEnvs } from '@config/init-envs';
import { DI } from '@videomatt/shared/di/di';
import { PostgresDB } from '@videomatt/shared/infrastructure/persistence/postgres';
import { VideoRoutes } from '@videomatt/videos/infrastructure/routes/routes';

initEnvs();

const app = express();
const port = getEnvs().PORT;

app.use(helmet());
app.use(express.json());

const db = new PostgresDB();
db.initDb();

const di = new DI(db);
di.initDi();

const routes = container.resolve(VideoRoutes);
routes.initRoutes(app);

app.listen(port, async () => {
    await db.syncDb();
    console.log(`Server running on http://localhost:${port}`);
});
