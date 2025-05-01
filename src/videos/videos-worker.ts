import 'reflect-metadata';

import { SQSEventConsumer } from '@shared/infrastructure/broker/sqs-event.consumer';
import { VIDEO_TOKEN } from '@videos/videos/infrastructure/di/tokens-video';

import { inject, injectable } from 'tsyringe';

@injectable()
export class SQSWorker {
    private readonly consumers: SQSEventConsumer[] = [];

    constructor(@inject(VIDEO_TOKEN.SQS_EVENT_VIDEO_CREATED_CONSUMER) videoCreatedConsumer: SQSEventConsumer) {
        this.consumers.push(videoCreatedConsumer);
    }

    async start() {
        while (true) {
            await Promise.allSettled(this.consumers.map((consumer) => consumer.consume()));
        }
    }
}
