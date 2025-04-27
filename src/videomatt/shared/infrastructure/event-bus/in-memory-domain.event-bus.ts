import { RemoteEventProducer } from '@videomatt/shared/domain/broker/remote-event.producer';
import { LocalEventPublisher } from '@videomatt/shared/domain/broker/local-event.publisher';
import { DomainEventBus } from '@videomatt/shared/domain/event-bus/domain-event-bus';
import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain.event';
import { singleton } from 'tsyringe';

@singleton()
export class InMemoryDomainEventBus implements DomainEventBus {
    private readonly localPublishers: LocalEventPublisher[] = [];
    private readonly remoteProducers: RemoteEventProducer[] = [];

    registerLocalPublisher(publisher: LocalEventPublisher): void {
        this.localPublishers.push(publisher);
    }

    registerRemoteProducer(producer: RemoteEventProducer): void {
        this.remoteProducers.push(producer);
    }

    async publish(events: DomainEvent[]) {
        for (const event of events) {
            if (event.isLocal()) {
                await this.publishLocalEvent(event, this.localPublishers);
            }
            if (event.isRemote()) {
                await this.publishRemoteEvent(event, this.remoteProducers);
            }
        }
    }

    private async publishLocalEvent(event: DomainEvent, producers: LocalEventPublisher[]) {
        for (const producer of producers) {
            producer.publish(event);
        }
    }

    private async publishRemoteEvent(event: DomainEvent, producers: RemoteEventProducer[]) {
        for (const producer of producers) {
            await producer.publish(event);
        }
    }
}
