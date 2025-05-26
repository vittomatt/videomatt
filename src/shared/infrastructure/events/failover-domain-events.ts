import { DomainEvent } from '@shared/domain/event-bus/domain.event';

export interface FailoverDomainEvents {
    publish(event: DomainEvent): Promise<void>;
    consume(): Promise<DomainEvent[]>;
}
