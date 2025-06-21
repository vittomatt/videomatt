import { LocalEventSubscriber } from '@shared/domain/broker/local-event.subscriber';
import { DomainEvent } from '@shared/domain/event-bus/domain.event';
import { VideoCreatedEvent } from '@shared/domain/events/video-created.event';
import { Logger } from '@shared/domain/logger/logger';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { InMemoryVideoEventPublisher } from '@videos/videos/infrastructure/broker/publishers/in-memory-video-event.publisher';
import { CreateVideoProjectionHandler } from '@videos/videos/infrastructure/handlers/domain/create-video-projection.handler';

import { inject, injectable } from 'tsyringe';

@injectable()
export class InMemoryEventVideoCreatedSubscriber implements LocalEventSubscriber {
    constructor(
        @inject(CreateVideoProjectionHandler)
        private readonly handler: CreateVideoProjectionHandler,
        @inject(InMemoryVideoEventPublisher)
        private readonly publisher: InMemoryVideoEventPublisher,
        @inject(TOKEN.LOGGER)
        private readonly logger: Logger
    ) {
        this.publisher.registerHandler(VideoCreatedEvent.eventName, this);
    }

    async consume(event: DomainEvent) {
        try {
            await this.handler.handle(event);
        } catch (error) {
            const eventName = (event.constructor as typeof DomainEvent).eventName;
            this.logger.error(`Error consuming event ${eventName}:`);
        }
    }
}
