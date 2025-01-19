import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain-event';

export interface EventPublisher {
    publish(event: DomainEvent): Promise<void>;
}
