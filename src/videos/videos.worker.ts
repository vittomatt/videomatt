import 'reflect-metadata';

import { RemoteEventConsumer } from '@shared/domain/broker/remote-event.consumer';
import { Logger } from '@shared/domain/logger/logger';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { Worker } from '@shared/worker';

import { inject, injectable } from 'tsyringe';

@injectable()
export class SQSWorker extends Worker {
    private readonly consumers: RemoteEventConsumer[] = [];

    constructor(
        @inject(TOKEN.LOGGER)
        private readonly logger: Logger
    ) {
        super();
    }

    registerConsumer(consumer: RemoteEventConsumer): void {
        this.consumers.push(consumer);
    }

    async start() {
        if (this.consumers.length === 0) {
            return;
        }
    }
}
