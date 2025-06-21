import { SNSClient } from '@aws-sdk/client-sns';
import { DomainEventBus } from '@shared/domain/event-bus/domain-event-bus';
import { DomainEvent } from '@shared/domain/event-bus/domain.event';
import { Logger } from '@shared/domain/logger/logger';
import { SNSEventProducer } from '@shared/infrastructure/broker/sns-event.producer';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { FailoverDomainEvents } from '@shared/infrastructure/events/failover-domain-events';
import { VIDEO_TOKEN } from '@videos/videos/infrastructure/di/video.tokens';
import { VideoDomainEventFailover } from '@videos/videos/infrastructure/events/videos-failover-domain-event';

import { inject, injectable } from 'tsyringe';

@injectable()
export class SNSVideoEventProducer extends SNSEventProducer {
    constructor(
        @inject(TOKEN.DOMAIN_EVENT_BUS) protected readonly eventBus: DomainEventBus,
        @inject(TOKEN.SNS_CLIENT) protected readonly sns: SNSClient,
        @inject(TOKEN.LOGGER) protected readonly logger: Logger,
        @inject(VideoDomainEventFailover) protected readonly failover: FailoverDomainEvents,
        @inject(VIDEO_TOKEN.SNS_TOPIC_ARN) private readonly topicArn: string
    ) {
        super(eventBus, sns, logger, failover);
    }

    getTopic(): string {
        return this.topicArn;
    }

    isValidEvent(event: DomainEvent): boolean {
        return event.getService() === 'videos';
    }
}
