import { IncreaseAmountOfVideosOnVideoPublishedHandler } from '@videomatt/users/infrastructure/handlers/increase-amount-of-videos-on-video-published.handler';
import { SQSEventConsumer } from '@videomatt/shared/infrastructure/broker/sqs-event.consumer';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { Logger } from '@videomatt/shared/domain/logger/logger';
import { SQSClient } from '@aws-sdk/client-sqs';
import { inject, injectable } from 'tsyringe';

@injectable()
export class SQSEventVideoPublishedConsumer extends SQSEventConsumer {
    constructor(
        @inject(TOKEN.SHARED.SQS_CLIENT) protected readonly sqsClient: SQSClient,
        @inject(TOKEN.VIDEO.SQS_VIDEO_PUBLISHED_QUEUE_URL) protected readonly queueUrl: string,
        @inject(TOKEN.SHARED.LOGGER) protected readonly logger: Logger,
        @inject(TOKEN.USER.INCREASE_AMOUNT_OF_VIDEOS_ON_VIDEO_PUBLISHED_HANDLER)
        protected readonly handler: IncreaseAmountOfVideosOnVideoPublishedHandler
    ) {
        super(sqsClient, queueUrl, logger, handler);
    }
}
