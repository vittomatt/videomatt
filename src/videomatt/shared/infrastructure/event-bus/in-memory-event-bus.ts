import { inject, injectable } from 'tsyringe';

import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain-event';
import { EventBus } from '@videomatt/shared/domain/event-bus/event-bus';
import { EventPublisher } from '@videomatt/shared/domain/broker/event.publisher';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';

@injectable()
export class InMemoryEventBus implements EventBus {
    constructor(
        @inject(TOKEN.VIDEO.SNS_EVENT_PUBLISHER) private readonly videoPublisher: EventPublisher,
        @inject(TOKEN.USER.SNS_EVENT_PUBLISHER) private readonly userPublisher: EventPublisher
    ) {}

    async publish(events: DomainEvent[]) {
        for (const event of events) {
            await this.videoPublisher.publish(event);
            await this.userPublisher.publish(event);
        }
    }
}
