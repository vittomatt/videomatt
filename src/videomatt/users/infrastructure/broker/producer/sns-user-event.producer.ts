import { SNSClient } from '@aws-sdk/client-sns';

import { inject, injectable } from 'tsyringe';

import { DomainEventBus } from '@videomatt/shared/domain/event-bus/domain-event-bus';
import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain.event';
import { Logger } from '@videomatt/shared/domain/logger/logger';
import { SNSEventProducer } from '@videomatt/shared/infrastructure/broker/sns-event.producer';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { USER_TOKEN } from '@videomatt/users/infrastructure/di/tokens-user';

@injectable()
export class SNSUserEventProducer extends SNSEventProducer {
    constructor(
        @inject(TOKEN.DOMAIN_EVENT_BUS) protected readonly eventBus: DomainEventBus,
        @inject(TOKEN.SNS_CLIENT) protected readonly sns: SNSClient,
        @inject(TOKEN.LOGGER) protected readonly logger: Logger,
        @inject(USER_TOKEN.SNS_TOPIC_ARN) private readonly topicArn: string
    ) {
        super(eventBus, sns, logger);
    }

    getTopic(): string {
        return this.topicArn;
    }

    isValidEvent(event: DomainEvent): boolean {
        return event.getEntity() === 'user';
    }
}
