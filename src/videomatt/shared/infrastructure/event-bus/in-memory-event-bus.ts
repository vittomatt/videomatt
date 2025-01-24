import { inject, injectable } from 'tsyringe';

import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain-event';
import { EventBus } from '@videomatt/shared/domain/event-bus/event-bus';
import { EventPublisher } from '@videomatt/shared/domain/broker/event.publisher';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';

@injectable()
export class InMemoryEventBus implements EventBus {
    private readonly publishers: EventPublisher[] = [];

    constructor(
        @inject(TOKEN.VIDEO.SNS_EVENT_PUBLISHER) readonly videoPublisher: EventPublisher,
        @inject(TOKEN.USER.SNS_EVENT_PUBLISHER) readonly userPublisher: EventPublisher
    ) {
        this.publishers.push(userPublisher, videoPublisher);
    }

    async publish(events: DomainEvent[]) {
        for (const event of events) {
            for (const publisher of this.publishers) {
                publisher.publish(event);
            }
        }
    }
}
