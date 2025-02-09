import { IncreaseAmountOfCommentsHandler } from '@videomatt/videos/videos/infrastructure/handlers/increase-amount-of-comments.handler';
import { LocalEventSubscriber } from '@videomatt/shared/domain/broker/local-event.subscriber';
import { VIDEO_TOKEN } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain-event';
import { inject, injectable } from 'tsyringe';

@injectable()
export class InMemoryEventCommentAddedSubscriber implements LocalEventSubscriber {
    constructor(
        @inject(VIDEO_TOKEN.INCREASE_AMOUNT_OF_COMMENTS_HANDLER)
        private readonly handler: IncreaseAmountOfCommentsHandler
    ) {}

    async consume(event: DomainEvent): Promise<void> {
        this.handler.handle(event);
    }
}
