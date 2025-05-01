import { LocalEventSubscriber } from '@shared/domain/broker/local-event.subscriber';
import { DomainEvent } from '@shared/domain/event-bus/domain.event';

export interface LocalEventPublisher {
    registerHandler(event: string, handler: LocalEventSubscriber): void;
    publish(event: DomainEvent): Promise<void>;
}
