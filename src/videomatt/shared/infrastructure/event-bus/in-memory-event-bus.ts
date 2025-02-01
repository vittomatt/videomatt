import { VIDEO_TOKENS } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { EventPublisher } from '@videomatt/shared/domain/broker/event.publisher';
import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain-event';
import { USER_TOKENS } from '@videomatt/users/infrastructure/di/tokens-user';
import { EventBus } from '@videomatt/shared/domain/event-bus/event-bus';
import { inject, injectable } from 'tsyringe';

@injectable()
export class InMemoryEventBus implements EventBus {
    private readonly publishers: EventPublisher[] = [];

    constructor(
        @inject(VIDEO_TOKENS.SNS_EVENT_PUBLISHER) readonly videoPublisher: EventPublisher,
        @inject(USER_TOKENS.SNS_EVENT_PUBLISHER) readonly userPublisher: EventPublisher
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
