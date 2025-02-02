import { CreateVideoReadHandler } from '@videomatt/videos/videos/infrastructure/handlers/domain/create-video-read.handler';
import { SQSEventConsumer } from '@videomatt/shared/infrastructure/broker/sqs-event.consumer';
import { VIDEO_TOKEN } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { Logger } from '@videomatt/shared/domain/logger/logger';
import { SQSClient } from '@aws-sdk/client-sqs';
import { inject, injectable } from 'tsyringe';

@injectable()
export class SQSEventVideoPublishedConsumer extends SQSEventConsumer {
    constructor(
        @inject(TOKEN.SQS_CLIENT) protected readonly sqsClient: SQSClient,
        @inject(VIDEO_TOKEN.SQS_VIDEO_PUBLISHED_QUEUE_URL) protected readonly queueUrl: string,
        @inject(TOKEN.LOGGER) protected readonly logger: Logger,
        @inject(VIDEO_TOKEN.CREATE_VIDEO_READ_HANDLER)
        protected readonly handler: CreateVideoReadHandler
    ) {
        super(sqsClient, queueUrl, logger, handler);
    }
}
