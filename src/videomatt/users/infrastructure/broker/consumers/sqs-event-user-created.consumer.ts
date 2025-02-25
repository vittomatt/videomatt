import { SQSEventConsumer } from '@videomatt/shared/infrastructure/broker/sqs-event.consumer';
import { USER_TOKEN } from '@videomatt/users/infrastructure/di/tokens-user';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { Logger } from '@videomatt/shared/domain/logger/logger';
import { SQSClient } from '@aws-sdk/client-sqs';
import { inject, injectable } from 'tsyringe';

@injectable()
export class SQSEventUserCreatedConsumer extends SQSEventConsumer {
    constructor(
        @inject(TOKEN.SQS_CLIENT) protected readonly sqsClient: SQSClient,
        @inject(USER_TOKEN.SQS_USER_CREATED_QUEUE_URL) protected readonly queueUrl: string,
        @inject(TOKEN.LOGGER) protected readonly logger: Logger
    ) {
        super(sqsClient, queueUrl, logger);
    }
}
