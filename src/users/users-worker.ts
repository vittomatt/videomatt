import 'reflect-metadata';

import { SQSEventConsumer } from '@shared/infrastructure/broker/sqs-event.consumer';
import { USER_TOKEN } from '@users/infrastructure/di/tokens-user';

import { inject, injectable } from 'tsyringe';

@injectable()
export class SQSWorker {
    private readonly consumers: SQSEventConsumer[] = [];

    constructor(@inject(USER_TOKEN.SQS_EVENT_USER_CREATED_CONSUMER) userCreatedConsumer: SQSEventConsumer) {
        this.consumers.push(userCreatedConsumer);
    }

    async start() {
        while (true) {
            await Promise.allSettled(this.consumers.map((consumer) => consumer.consume()));
        }
    }
}
