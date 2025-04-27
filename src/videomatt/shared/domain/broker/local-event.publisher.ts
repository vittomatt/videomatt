import { LocalEventSubscriber } from '@videomatt/shared/domain/broker/local-event.subscriber';
import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain.event';

export interface LocalEventPublisher {
    registerHandler(event: string, handler: LocalEventSubscriber): void;
    publish(event: DomainEvent): Promise<void>;
}
