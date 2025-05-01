import 'reflect-metadata';

import { RemoteEventConsumer } from '@shared/domain/broker/remote-event.consumer';
import { Worker } from '@shared/worker';

import { singleton } from 'tsyringe';

@singleton()
export class SQSWorker implements Worker {
    private readonly consumers: RemoteEventConsumer[] = [];

    registerConsumer(consumer: RemoteEventConsumer): void {
        this.consumers.push(consumer);
    }

    async start() {
        if (this.consumers.length === 0) {
            return;
        }

        while (true) {
            await Promise.allSettled(this.consumers.map((consumer) => consumer.consume()));
        }
    }
}
