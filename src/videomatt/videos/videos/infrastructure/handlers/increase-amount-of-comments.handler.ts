import { IncreaseAmountOfCommentsUseCase } from '@videomatt/videos/videos/application/increase-amount-of-comments/increase-amount-of-comments.use-case';
import { VideoCommentAddedEvent } from '@videomatt/videos/video-comment/domain/events/video-comment-added.event';
import { VIDEO_TOKEN } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { DomainHandler } from '@videomatt/shared/domain/broker/domain-handler';
import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain-event';
import { inject, injectable } from 'tsyringe';

@injectable()
export class IncreaseAmountOfCommentsHandler implements DomainHandler<void> {
    constructor(
        @inject(VIDEO_TOKEN.INCREASE_AMOUNT_OF_COMMENTS_USE_CASE)
        private readonly useCase: IncreaseAmountOfCommentsUseCase
    ) {}

    async handle(event: DomainEvent) {
        const videoEvent = event as VideoCommentAddedEvent;
        const commentId = videoEvent.commentId;
        await this.useCase.execute(videoEvent.videoId, commentId);
    }
}
