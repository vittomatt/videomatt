import { DomainEvent } from '@shared/domain/event-bus/domain.event';

export interface RemoteEventProducer {
    publish(event: DomainEvent): Promise<void>;
    publishFromFailover(): Promise<void>;
    getTopic(): string;
    isValidEvent(event: DomainEvent): boolean;
}
