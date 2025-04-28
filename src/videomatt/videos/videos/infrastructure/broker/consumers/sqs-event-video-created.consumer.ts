import { SQSClient } from '@aws-sdk/client-sqs';
import { inject, injectable } from 'tsyringe';

import { IncreaseAmountOfVideosHandler } from '@videomatt/users/infrastructure/handlers/domain/increase-amount-of-videos.handler';
import { SQSEventConsumer } from '@videomatt/shared/infrastructure/broker/sqs-event.consumer';
import { VIDEO_TOKEN } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { USER_TOKEN } from '@videomatt/users/infrastructure/di/tokens-user';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { Logger } from '@videomatt/shared/domain/logger/logger';

@injectable()
export class SQSEventVideoCreatedConsumer extends SQSEventConsumer {
    constructor(
        @inject(TOKEN.SQS_CLIENT) protected readonly sqsClient: SQSClient,
        @inject(VIDEO_TOKEN.SQS_VIDEO_CREATED_QUEUE_URL) protected readonly queueUrl: string,
        @inject(TOKEN.LOGGER) protected readonly logger: Logger,
        @inject(USER_TOKEN.INCREASE_AMOUNT_OF_VIDEOS_HANDLER)
        protected readonly handler: IncreaseAmountOfVideosHandler
    ) {
        super(sqsClient, queueUrl, logger, handler);
    }
}
