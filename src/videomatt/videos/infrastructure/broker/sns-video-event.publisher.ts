import { inject, injectable } from 'tsyringe';
import { SNSClient } from '@aws-sdk/client-sns';

import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { SNSEventPublisher } from '@videomatt/shared/infrastructure/broker/sns-event.publisher';
import { Logger } from '@videomatt/shared/domain/logger/logger';

@injectable()
export class SNSVideoEventPublisher extends SNSEventPublisher {
    constructor(
        @inject(TOKEN.SHARED.SNS_CLIENT) protected readonly sns: SNSClient,
        @inject(TOKEN.VIDEO.SNS_TOPIC_ARN) protected readonly topicArn: string,
        @inject(TOKEN.SHARED.LOGGER) protected readonly logger: Logger
    ) {
        super(sns, topicArn, logger);
    }
}
