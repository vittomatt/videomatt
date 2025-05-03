import { LocalEventSubscriber } from '@shared/domain/broker/local-event.subscriber';
import { DomainEvent } from '@shared/domain/event-bus/domain.event';
import { VideoCommentAddedEvent } from '@videos/video-comment/domain/events/video-comment-added.event';
import { InMemoryVideoEventPublisher } from '@videos/videos/infrastructure/broker/publishers/in-memory-video-event.publisher';
import { VIDEO_TOKEN } from '@videos/videos/infrastructure/di/tokens-video';
import { IncreaseAmountOfCommentsHandler } from '@videos/videos/infrastructure/handlers/increase-amount-of-comments.handler';

import { inject, injectable } from 'tsyringe';

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

    async consume(event: DomainEvent) {
        this.handler.handle(event);
    }
}
