import { CreateVideoReadOnVideoPublishedHandler } from '@videomatt/videos/videos/infrastructure/handlers/create-video-read-on-video-published.handler';
import { SQSEventConsumer } from '@videomatt/shared/infrastructure/broker/sqs-event.consumer';
import { VIDEO_TOKENS } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { Logger } from '@videomatt/shared/domain/logger/logger';
import { SQSClient } from '@aws-sdk/client-sqs';
import { inject, injectable } from 'tsyringe';
import { SQSWorker } from 'src/workers';

@injectable()
export class SQSEventVideoPublishedConsumer extends SQSEventConsumer {
    constructor(
        @inject(TOKEN.SQS_CLIENT) protected readonly sqsClient: SQSClient,
        @inject(VIDEO_TOKENS.SQS_VIDEO_PUBLISHED_QUEUE_URL) protected readonly queueUrl: string,
        @inject(TOKEN.LOGGER) protected readonly logger: Logger,
        @inject(VIDEO_TOKENS.CREATE_VIDEO_READ_ON_VIDEO_PUBLISHED_HANDLER)
        protected readonly handler: CreateVideoReadOnVideoPublishedHandler
    ) {
        super(sqsClient, queueUrl, logger, handler);
    }
}
