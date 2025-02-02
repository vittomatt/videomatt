import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain-event';

export interface DomainHandler<T> {
    handle(event: DomainEvent): Promise<T>;
}
