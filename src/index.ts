import express from 'express';
import helmet from 'helmet';

import { getEnvs, initEnvs } from '@config/init-envs';
import { PostgresDB } from '@videomatt/shared/infrastructure/persistence/postgres';
import { CreateVideo } from '@videomatt/videos/application/create-video';
import { DBVideoRepository } from '@videomatt/videos/infrastructure/repositories/db-video-repository';
import { DBVideo } from '@videomatt/videos/infrastructure/models/db-video';

initEnvs();

const app = express();
const port = getEnvs().PORT;

app.use(helmet());
app.use(express.json());

const db = new PostgresDB();
db.initDb();

app.use('/api/videos', async (req, res) => {
    const dbVideo = db.getVideoModel();
    const videoRepository = new DBVideoRepository(dbVideo);
    await new CreateVideo(videoRepository);
    res.send('Hello World');
});

app.listen(port, async () => {
    console.log(`Server running on http://localhost:${port}`);
});
