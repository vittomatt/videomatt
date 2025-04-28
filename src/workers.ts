import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { SQSEventConsumer } from '@videomatt/shared/infrastructure/broker/sqs-event.consumer';
import { VIDEO_TOKEN } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { USER_TOKEN } from '@videomatt/users/infrastructure/di/tokens-user';

@injectable()
export class SQSWorker {
    private readonly consumers: SQSEventConsumer[] = [];

    constructor(
        @inject(USER_TOKEN.SQS_EVENT_USER_CREATED_CONSUMER) userCreatedConsumer: SQSEventConsumer,
        @inject(VIDEO_TOKEN.SQS_EVENT_VIDEO_CREATED_CONSUMER) videoCreatedConsumer: SQSEventConsumer
    ) {
        this.consumers.push(userCreatedConsumer);
        this.consumers.push(videoCreatedConsumer);
    }

    async start() {
        while (true) {
            await Promise.allSettled(this.consumers.map((consumer) => consumer.consume()));
        }
    }
}
