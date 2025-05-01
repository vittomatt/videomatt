import { LocalEventSubscriber } from '@shared/domain/broker/local-event.subscriber';
import { DomainEvent } from '@shared/domain/event-bus/domain.event';
import { VideoCreatedEvent } from '@videos/videos/domain/events/video-created.event';
import { InMemoryVideoEventPublisher } from '@videos/videos/infrastructure/broker/publishers/in-memory-video-event.publisher';
import { VIDEO_TOKEN } from '@videos/videos/infrastructure/di/tokens-video';
import { CreateVideoReadHandler } from '@videos/videos/infrastructure/handlers/domain/create-video-read.handler';

import { inject, injectable } from 'tsyringe';

@injectable()
export class InMemoryEventVideoCreatedSubscriber implements LocalEventSubscriber {
    constructor(
        @inject(VIDEO_TOKEN.CREATE_VIDEO_READ_HANDLER)
        private readonly handler: CreateVideoReadHandler,
        @inject(VIDEO_TOKEN.IN_MEMORY_EVENT_PUBLISHER)
        private readonly publisher: InMemoryVideoEventPublisher
    ) {
        this.publisher.registerHandler(VideoCreatedEvent.eventName, this);
    }

    async consume(event: DomainEvent): Promise<void> {
        this.handler.handle(event);
    }
}
