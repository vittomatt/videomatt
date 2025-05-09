import { LocalEventSubscriber } from '@shared/domain/broker/local-event.subscriber';
import { DomainEvent } from '@shared/domain/event-bus/domain.event';
import { VideoCreatedEvent } from '@shared/domain/events/video-created.event';
import { Logger } from '@shared/domain/logger/logger';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { InMemoryVideoEventPublisher } from '@videos/videos/infrastructure/broker/publishers/in-memory-video-event.publisher';
import { VIDEO_TOKEN } from '@videos/videos/infrastructure/di/video.tokens';
import { CreateVideoWithAmountOfCommentsHandler } from '@videos/videos/infrastructure/handlers/domain/create-video-with-amount-of-comments.handler';

import { inject, injectable } from 'tsyringe';

@injectable()
export class InMemoryEventVideoCreatedSubscriber implements LocalEventSubscriber {
    constructor(
        @inject(VIDEO_TOKEN.CREATE_VIDEO_WITH_AMOUNT_OF_COMMENTS_HANDLER)
        private readonly handler: CreateVideoWithAmountOfCommentsHandler,
        @inject(VIDEO_TOKEN.IN_MEMORY_EVENT_PUBLISHER)
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
            this.logger.error(`Error consuming event ${event.eventName}:`);
        }
    }
}
