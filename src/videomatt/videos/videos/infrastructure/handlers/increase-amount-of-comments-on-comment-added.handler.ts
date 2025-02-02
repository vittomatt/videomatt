import { IncreaseAmountOfCommentsUseCase } from '@videomatt/videos/videos/application/increase-amount-of-comments/increase-amount-of-comments.use-case';
import { VideoCommentAddedEvent } from '@videomatt/videos/video-comment/domain/events/video-comment-added.event';
import { VIDEO_TOKENS } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain-event';
import { Handler } from '@videomatt/shared/domain/broker/handler';
import { inject, injectable } from 'tsyringe';

@injectable()
export class IncreaseAmountOfCommentsOnCommentAddedHandler implements Handler {
    constructor(
        @inject(VIDEO_TOKENS.INCREASE_AMOUNT_OF_COMMENTS_USE_CASE)
        private readonly useCase: IncreaseAmountOfCommentsUseCase
    ) {}

    async handle(event: DomainEvent) {
        const videoEvent = event as VideoCommentAddedEvent;
        await this.useCase.execute(videoEvent.videoId);
    }
}
