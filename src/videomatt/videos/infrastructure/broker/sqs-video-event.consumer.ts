import { inject, injectable } from 'tsyringe';
import { SQSClient } from '@aws-sdk/client-sqs';

import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { SQSEventConsumer } from '@videomatt/shared/infrastructure/broker/sqs-even.consumer';
import { Logger } from '@videomatt/shared/domain/logger/logger';
import { Handler } from '@videomatt/shared/domain/broker/handler';
@injectable()
export class SQSVideoEventConsumer extends SQSEventConsumer {
    constructor(
        @inject(TOKEN.SHARED.SQS_CLIENT) protected readonly sqsClient: SQSClient,
        @inject(TOKEN.VIDEO.SQS_QUEUE_URL) protected readonly queueUrl: string,
        @inject(TOKEN.SHARED.LOGGER) protected readonly logger: Logger,
        @inject(TOKEN.VIDEO.HANDLER) protected readonly handler: Handler
    ) {
        super(sqsClient, queueUrl, logger, handler);
    }
}
