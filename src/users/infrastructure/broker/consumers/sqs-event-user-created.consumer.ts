import { SQSClient } from '@aws-sdk/client-sqs';
import { Logger } from '@shared/domain/logger/logger';
import { SQSEventConsumer } from '@shared/infrastructure/broker/sqs-event.consumer';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { Worker } from '@shared/worker';
import { USER_TOKEN } from '@users/infrastructure/di/user.tokens';
import { UserCreatedHandler } from '@users/infrastructure/handlers/domain/user-created.handler';
import { SQSWorker } from '@users/users.worker';

import { inject, injectable } from 'tsyringe';

@injectable()
export class SQSEventUserCreatedConsumer extends SQSEventConsumer {
    constructor(
        @inject(TOKEN.SQS_CLIENT) protected readonly sqsClient: SQSClient,
        @inject(USER_TOKEN.SQS_USER_CREATED_QUEUE_URL) protected readonly queueUrl: string,
        @inject(TOKEN.LOGGER) protected readonly logger: Logger,
        @inject(SQSWorker) protected readonly worker: Worker,
        @inject(UserCreatedHandler) protected readonly handler: UserCreatedHandler
    ) {
        super(sqsClient, queueUrl, logger, worker, handler);
    }
}
