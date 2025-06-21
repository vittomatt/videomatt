import { EventBridgeClient } from '@aws-sdk/client-eventbridge';
import { DomainEventBus } from '@shared/domain/event-bus/domain-event-bus';
import { DomainEvent } from '@shared/domain/event-bus/domain.event';
import { Logger } from '@shared/domain/logger/logger';
import { EventBridgeEventProducer } from '@shared/infrastructure/broker/event-bridge.producer';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { FailoverDomainEvents } from '@shared/infrastructure/events/failover-domain-events';
import { USER_TOKEN } from '@users/infrastructure/di/user.tokens';
import { UserDomainEventFailover } from '@users/infrastructure/events/user-failover-domain-event';

import { inject, injectable } from 'tsyringe';

@injectable()
export class EventBridgeUserEventProducer extends EventBridgeEventProducer {
    constructor(
        @inject(TOKEN.DOMAIN_EVENT_BUS) protected readonly eventBus: DomainEventBus,
        @inject(TOKEN.EVENT_BRIDGE_CLIENT) protected readonly eventBridgeClient: EventBridgeClient,
        @inject(TOKEN.LOGGER) protected readonly logger: Logger,
        @inject(UserDomainEventFailover) protected readonly failover: FailoverDomainEvents,
        @inject(USER_TOKEN.EVENT_BRIDGE_USER_TOPIC_ARN) private readonly topicArn: string
    ) {
        super(eventBus, eventBridgeClient, logger, failover);
    }

    getTopic(): string {
        return this.topicArn;
    }

    isValidEvent(event: DomainEvent): boolean {
        return event.getService() === 'users';
    }
}
