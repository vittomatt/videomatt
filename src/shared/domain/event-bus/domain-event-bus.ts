import { LocalEventPublisher } from '@shared/domain/broker/local-event.publisher';
import { RemoteEventProducer } from '@shared/domain/broker/remote-event.producer';
import { DomainEvent } from '@shared/domain/event-bus/domain.event';

export interface DomainEventBus {
    registerLocalPublisher(publisher: LocalEventPublisher): void;
    registerRemoteProducer(producer: RemoteEventProducer): void;
    publish(event: DomainEvent[]): Promise<void>;
}
