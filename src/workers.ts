import 'reflect-metadata';

import { SQSEventConsumer } from '@videomatt/shared/infrastructure/broker/sqs-event.consumer';
import { VIDEO_TOKEN } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { USER_TOKEN } from '@videomatt/users/infrastructure/di/tokens-user';
import { injectable, inject } from 'tsyringe';

@injectable()
export class SQSWorker {
    private readonly consumers: SQSEventConsumer[] = [];

    constructor(
        @inject(VIDEO_TOKEN.SQS_EVENT_VIDEO_PUBLISHED_CONSUMER) videoConsumer: SQSEventConsumer,
        @inject(VIDEO_TOKEN.SQS_EVENT_COMMENT_ADDED_CONSUMER) videoCommentAddedConsumer: SQSEventConsumer,
        @inject(USER_TOKEN.SQS_EVENT_VIDEO_PUBLISHED_CONSUMER) userConsumer: SQSEventConsumer
    ) {
        this.consumers.push(videoConsumer);
        this.consumers.push(videoCommentAddedConsumer);
        this.consumers.push(userConsumer);
    }

    async start() {
        while (true) {
            await Promise.allSettled(this.consumers.map((consumer) => consumer.consume()));
        }
    }
}
