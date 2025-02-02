import { VIDEO_TOKEN } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { DomainEventBus } from '@videomatt/shared/domain/event-bus/domain-event-bus';
import { EventPublisher } from '@videomatt/shared/domain/broker/event.publisher';
import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain-event';
import { USER_TOKEN } from '@videomatt/users/infrastructure/di/tokens-user';
import { inject, injectable } from 'tsyringe';

@injectable()
export class InMemoryDomainEventBus implements DomainEventBus {
    private readonly publishers: EventPublisher[] = [];

    constructor(
        @inject(VIDEO_TOKEN.SNS_EVENT_PUBLISHER) readonly videoPublisher: EventPublisher,
        @inject(USER_TOKEN.SNS_EVENT_PUBLISHER) readonly userPublisher: EventPublisher
    ) {
        this.publishers.push(userPublisher, videoPublisher);
    }

    // fitu here add in memory busses
    // also check that events works with DTO
    async publish(events: DomainEvent[]) {
        for (const event of events) {
            for (const publisher of this.publishers) {
                await publisher.publish(event);
            }
        }
    }
}
