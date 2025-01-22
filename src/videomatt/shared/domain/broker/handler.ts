import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain-event';

export interface Handler {
    handle(event: DomainEvent): Promise<void>;
}
