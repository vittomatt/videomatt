import { DomainEvent } from '@shared/domain/event-bus/domain.event';
import { ExtractPrimitives } from '@shared/domain/models/extract-primitives';

export abstract class AggregateRoot<T> {
    private domainEvents: DomainEvent[] = [];

    abstract toPrimitives(): ExtractPrimitives<T>;

    pullDomainEvents(): DomainEvent[] {
        const domainEvents = this.domainEvents;
        this.domainEvents = [];
        return domainEvents;
    }

    record(event: DomainEvent): void {
        this.domainEvents.push(event);
    }
}
