import { LocalEventSubscriber } from '@shared/domain/broker/local-event.subscriber';
import { DomainEvent } from '@shared/domain/event-bus/domain.event';
import { Logger } from '@shared/domain/logger/logger';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { VideoCommentAddedEvent } from '@videos/video-comment/domain/events/video-comment-added.event';
import { InMemoryVideoEventPublisher } from '@videos/videos/infrastructure/broker/publishers/in-memory-video-event.publisher';
import { IncreaseAmountOfCommentsHandler } from '@videos/videos/infrastructure/handlers/domain/increase-amount-of-comments.handler';

import { inject, injectable } from 'tsyringe';

@injectable()
export class InMemoryEventCommentAddedSubscriber implements LocalEventSubscriber {
    constructor(
        @inject(IncreaseAmountOfCommentsHandler)
        private readonly handler: IncreaseAmountOfCommentsHandler,
        @inject(InMemoryVideoEventPublisher)
        private readonly publisher: InMemoryVideoEventPublisher,
        @inject(TOKEN.LOGGER)
        private readonly logger: Logger
    ) {
        this.publisher.registerHandler(VideoCommentAddedEvent.eventName, this);
    }

    async consume(event: DomainEvent) {
        try {
            await this.handler.handle(event);
        } catch (error) {
            this.logger.error(`Error consuming event ${event.eventName}:`);
        }
    }
}
