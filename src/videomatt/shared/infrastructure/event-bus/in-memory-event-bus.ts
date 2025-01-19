import { inject, injectable } from 'tsyringe';

import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain-event';
import { EventBus } from '@videomatt/shared/domain/event-bus/event-bus';
import { EventPublisher } from '@videomatt/shared/infrastructure/broker/event-publisher';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';

@injectable()
export class InMemoryEventBus implements EventBus {
    constructor(@inject(TOKEN.SNS_EVENT_PUBLISHER) private readonly publisher: EventPublisher) {}

    async publish(events: DomainEvent[]): Promise<void> {
        for (const event of events) {
            await this.publisher.publish(event);
        }
    }
}
