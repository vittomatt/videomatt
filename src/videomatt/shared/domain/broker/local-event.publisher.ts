import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain.event';

export interface LocalEventPublisher {
    publish(event: DomainEvent): Promise<void>;
}
