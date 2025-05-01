import { SQSClient } from '@aws-sdk/client-sqs';
import { Logger } from '@shared/domain/logger/logger';
import { SQSEventConsumer } from '@shared/infrastructure/broker/sqs-event.consumer';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { Worker } from '@shared/worker';
import { USER_TOKEN } from '@users/infrastructure/di/tokens-user';
import { IncreaseAmountOfVideosHandler } from '@users/infrastructure/handlers/domain/increase-amount-of-videos.handler';

import { inject, injectable } from 'tsyringe';

@injectable()
export class SQSEventVideoCreatedConsumer extends SQSEventConsumer {
    constructor(
        @inject(TOKEN.SQS_CLIENT) protected readonly sqsClient: SQSClient,
        @inject(USER_TOKEN.SQS_VIDEO_CREATED_QUEUE_URL) protected readonly queueUrl: string,
        @inject(TOKEN.LOGGER) protected readonly logger: Logger,
        @inject(TOKEN.WORKER_USER) protected readonly worker: Worker,
        @inject(USER_TOKEN.INCREASE_AMOUNT_OF_VIDEOS_HANDLER)
        protected readonly handler: IncreaseAmountOfVideosHandler
    ) {
        super(sqsClient, queueUrl, logger, worker, handler);
    }
}
