import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain.event';

export interface DomainEventBus {
    publish(event: DomainEvent[]): Promise<void>;
}
