import 'reflect-metadata';
import { container } from 'tsyringe';

import { initEnvs } from '@videomatt/shared/envs/init-envs';
import { DI } from '@videomatt/shared/infrastructure/di/di';
import { SQSEventVideoPublishedConsumer } from '@videomatt/users/infrastructure/broker/consumers/sqs-event-video-published.consumer';
import { PostgresDB } from '@videomatt/shared/infrastructure/persistence/postgres';

async function startConsumers() {
    console.log('SQS Consumer Worker started');
    initEnvs();

    const db = new PostgresDB();
    db.initDb();

    const di = new DI(db);
    di.initDi();

    const consumer = container.resolve(SQSEventVideoPublishedConsumer);

    while (true) {
        try {
            await consumer.consume();
        } catch (error) {
            console.error(`Error in consumer loop: ${error}`);
        }
    }
}

startConsumers();
