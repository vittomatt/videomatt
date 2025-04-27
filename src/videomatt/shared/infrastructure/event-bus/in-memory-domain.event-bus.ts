import { InMemoryVideoEventPublisher } from '@videomatt/videos/videos/infrastructure/broker/publishers/in-memory-video-event.publisher';
import { SNSVideoEventProducer } from '@videomatt/videos/videos/infrastructure/broker/producer/sns-video-event.producer';
import { SNSUserEventProducer } from '@videomatt/users/infrastructure/broker/producer/sns-user-event.producer';
import { RemoteEventProducer } from '@videomatt/shared/domain/broker/remote-event.producer';
import { LocalEventPublisher } from '@videomatt/shared/domain/broker/local-event.publisher';
import { VIDEO_TOKEN } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { DomainEventBus } from '@videomatt/shared/domain/event-bus/domain-event-bus';
import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain.event';
import { USER_TOKEN } from '@videomatt/users/infrastructure/di/tokens-user';
import { inject, injectable } from 'tsyringe';

@injectable()
export class InMemoryDomainEventBus implements DomainEventBus {
    private readonly localPublishers: LocalEventPublisher[] = [];
    private readonly remoteProducers: RemoteEventProducer[] = [];

    constructor(
        @inject(VIDEO_TOKEN.IN_MEMORY_EVENT_PUBLISHER) readonly inMemoryVideoPublisher: InMemoryVideoEventPublisher,
        @inject(VIDEO_TOKEN.SNS_EVENT_PRODUCER) readonly snsVideoProducer: SNSVideoEventProducer,
        @inject(USER_TOKEN.SNS_EVENT_PRODUCER) readonly snsUserProducer: SNSUserEventProducer
    ) {
        this.localPublishers.push(inMemoryVideoPublisher);
        this.remoteProducers.push(snsVideoProducer, snsUserProducer);
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
