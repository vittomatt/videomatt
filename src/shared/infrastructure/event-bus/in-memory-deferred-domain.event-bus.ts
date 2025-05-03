import { LocalEventPublisher } from '@shared/domain/broker/local-event.publisher';
import { RemoteEventProducer } from '@shared/domain/broker/remote-event.producer';
import { DomainEventBus } from '@shared/domain/event-bus/domain-event-bus';
import { DomainEvent } from '@shared/domain/event-bus/domain.event';
import { TOKEN } from '@shared/infrastructure/di/tokens';

import { inject, singleton } from 'tsyringe';

@singleton()
export class InMemoryDeferredDomainEventBus implements DomainEventBus {
    private events: DomainEvent[] = [];

    constructor(@inject(TOKEN.DOMAIN_EVENT_BUS) private readonly eventBus: DomainEventBus) {}

    registerLocalPublisher(publisher: LocalEventPublisher): void {
        this.eventBus.registerLocalPublisher(publisher);
    }

    registerRemoteProducer(producer: RemoteEventProducer): void {
        this.eventBus.registerRemoteProducer(producer);
    }
    async publish(events: DomainEvent[]) {
        this.events.push(...events);
        return Promise.resolve();
    }

    async publishDeferredEvents() {
        await this.eventBus.publish(this.events);
        this.events = [];
    }
}
