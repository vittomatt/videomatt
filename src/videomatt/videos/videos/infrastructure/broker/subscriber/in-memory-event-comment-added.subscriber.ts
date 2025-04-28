import { inject, injectable } from 'tsyringe';

import { LocalEventSubscriber } from '@videomatt/shared/domain/broker/local-event.subscriber';
import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain.event';
import { VideoCommentAddedEvent } from '@videomatt/videos/video-comment/domain/events/video-comment-added.event';
import { InMemoryVideoEventPublisher } from '@videomatt/videos/videos/infrastructure/broker/publishers/in-memory-video-event.publisher';
import { VIDEO_TOKEN } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { IncreaseAmountOfCommentsHandler } from '@videomatt/videos/videos/infrastructure/handlers/increase-amount-of-comments.handler';

@injectable()
export class InMemoryEventCommentAddedSubscriber implements LocalEventSubscriber {
    constructor(
        @inject(VIDEO_TOKEN.INCREASE_AMOUNT_OF_COMMENTS_HANDLER)
        private readonly handler: IncreaseAmountOfCommentsHandler,
        @inject(VIDEO_TOKEN.IN_MEMORY_EVENT_PUBLISHER)
        private readonly publisher: InMemoryVideoEventPublisher
    ) {
        this.publisher.registerHandler(VideoCommentAddedEvent.eventName, this);
    }

    async consume(event: DomainEvent): Promise<void> {
        this.handler.handle(event);
    }
}
