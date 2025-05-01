import { DomainEvent } from '@shared/domain/event-bus/domain.event';

export interface DomainHandler<T> {
    handle(event: DomainEvent): Promise<T>;
}
