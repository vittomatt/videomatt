import { DomainEvent } from '@shared/domain/event-bus/domain.event';

export interface LocalEventSubscriber {
    consume(event: DomainEvent): Promise<void>;
}
