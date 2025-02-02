import { IncreaseAmountOfCommentsOnCommentAddedHandler } from '@videomatt/videos/videos/infrastructure/handlers/increase-amount-of-comments-on-comment-added.handler';
import { SQSEventConsumer } from '@videomatt/shared/infrastructure/broker/sqs-event.consumer';
import { VIDEO_TOKENS } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { Logger } from '@videomatt/shared/domain/logger/logger';
import { SQSClient } from '@aws-sdk/client-sqs';
import { inject, injectable } from 'tsyringe';

@injectable()
export class SQSEventCommentAddedConsumer extends SQSEventConsumer {
    constructor(
        @inject(TOKEN.SQS_CLIENT) protected readonly sqsClient: SQSClient,
        @inject(VIDEO_TOKENS.SQS_COMMENT_ADDED_QUEUE_URL) protected readonly queueUrl: string,
        @inject(TOKEN.LOGGER) protected readonly logger: Logger,
        @inject(VIDEO_TOKENS.INCREASE_AMOUNT_OF_COMMENTS_ON_COMMENT_ADDED_HANDLER)
        protected readonly handler: IncreaseAmountOfCommentsOnCommentAddedHandler
    ) {
        super(sqsClient, queueUrl, logger, handler);
    }
}
