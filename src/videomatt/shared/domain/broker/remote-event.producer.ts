import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain.event';

export interface RemoteEventProducer {
    publish(event: DomainEvent): Promise<void>;
    getTopic(): string;
    isValidEvent(event: DomainEvent): boolean;
}
