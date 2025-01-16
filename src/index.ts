import 'reflect-metadata';

import express from 'express';
import helmet from 'helmet';
import { container } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';

import { getEnvs, initEnvs } from '@config/init-envs';
import { PostgresDB } from '@videomatt/shared/infrastructure/persistence/postgres';
import { CreateVideo } from '@videomatt/videos/application/create-video';
import { DI } from '@videomatt/shared/di/di';

initEnvs();

const app = express();
const port = getEnvs().PORT;

app.use(helmet());
app.use(express.json());

const db = new PostgresDB();
db.initDb();

const di = new DI(db);
di.register();

app.use('/api/videos', async (req, res) => {
    // const dbVideo = db.getVideoModel();
    const videoCreator = container.resolve(CreateVideo);
    const uuid = uuidv4();
    await videoCreator.execute(uuid, 'Video 1', 'Description 1', 'https://www.google.com');

    res.send('Hello World');
});

app.listen(port, async () => {
    await db.syncDb();
    console.log(`Server running on http://localhost:${port}`);
});
