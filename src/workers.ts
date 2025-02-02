import 'reflect-metadata';

import { SQSEventConsumer } from '@videomatt/shared/infrastructure/broker/sqs-event.consumer';
import { VIDEO_TOKENS } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { USER_TOKENS } from '@videomatt/users/infrastructure/di/tokens-user';
import { injectable, inject } from 'tsyringe';

@injectable()
export class SQSWorker {
    private readonly consumers: SQSEventConsumer[] = [];

    constructor(
        @inject(VIDEO_TOKENS.SQS_EVENT_VIDEO_PUBLISHED_CONSUMER) videoConsumer: SQSEventConsumer,
        @inject(VIDEO_TOKENS.SQS_EVENT_COMMENT_ADDED_CONSUMER) videoCommentAddedConsumer: SQSEventConsumer,
        @inject(USER_TOKENS.SQS_EVENT_VIDEO_PUBLISHED_CONSUMER) userConsumer: SQSEventConsumer
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
