import express from 'express';
import helmet from 'helmet';

import { getEnvs, initEnvs } from '@config/init-envs';
import { DB } from '@videomatt/shared/infrastructure/persistence/db';

initEnvs();

const app = express();
const port = getEnvs().PORT;

app.use(helmet());
app.use(express.json());

app.listen(port, async () => {
    const db = new DB();
    db.initDb();
    console.log(`Server running on http://localhost:${port}`);
});
