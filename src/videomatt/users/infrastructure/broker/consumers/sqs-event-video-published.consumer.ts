import { IncreaseAmountOfVideosOnVideoPublishedHandler } from '@videomatt/users/infrastructure/handlers/increase-amount-of-videos-on-video-published.handler';
import { SQSEventConsumer } from '@videomatt/shared/infrastructure/broker/sqs-event.consumer';
import { VIDEO_TOKENS } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { USER_TOKENS } from '@videomatt/users/infrastructure/di/tokens-user';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { Logger } from '@videomatt/shared/domain/logger/logger';
import { SQSClient } from '@aws-sdk/client-sqs';
import { inject, injectable } from 'tsyringe';

@injectable()
export class SQSEventVideoPublishedConsumer extends SQSEventConsumer {
    constructor(
        @inject(TOKEN.SQS_CLIENT) protected readonly sqsClient: SQSClient,
        @inject(VIDEO_TOKENS.SQS_VIDEO_PUBLISHED_QUEUE_URL) protected readonly queueUrl: string,
        @inject(TOKEN.LOGGER) protected readonly logger: Logger,
        @inject(USER_TOKENS.INCREASE_AMOUNT_OF_VIDEOS_ON_VIDEO_PUBLISHED_HANDLER)
        protected readonly handler: IncreaseAmountOfVideosOnVideoPublishedHandler
    ) {
        super(sqsClient, queueUrl, logger, handler);
    }
}
