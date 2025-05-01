import 'reflect-metadata';

import { RemoteEventConsumer } from '@shared/domain/broker/remote-event.consumer';
import { Worker } from '@shared/worker';

import { injectable } from 'tsyringe';

@injectable()
export class SQSWorker implements Worker {
    private readonly consumers: RemoteEventConsumer[] = [];

    registerConsumer(consumer: RemoteEventConsumer): void {
        this.consumers.push(consumer);
    }

    async start() {}
}
