import { SNSEventPublisher } from '@videomatt/shared/infrastructure/broker/sns-event.publisher';
import { TOKEN as TOKEN_USER } from '@videomatt/users/infrastructure/di/tokens-user';
import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain-event';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { Logger } from '@videomatt/shared/domain/logger/logger';
import { SNSClient } from '@aws-sdk/client-sns';
import { inject, injectable } from 'tsyringe';

@injectable()
export class SNSUserEventPublisher extends SNSEventPublisher {
    constructor(
        @inject(TOKEN.SNS_CLIENT) protected readonly sns: SNSClient,
        @inject(TOKEN.LOGGER) protected readonly logger: Logger,
        @inject(TOKEN_USER.SNS_TOPIC_ARN) private readonly topicArn: string
    ) {
        super(sns, logger);
    }

    getTopic(): string {
        return this.topicArn;
    }

    isValidEvent(event: DomainEvent): boolean {
        return event.getEntity() === 'user';
    }
}
