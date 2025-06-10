import { DomainHandler } from '@shared/domain/broker/domain-handler';
import { DomainEvent } from '@shared/domain/event-bus/domain.event';
import { VideoCommentAddedEvent } from '@videos/video-comment/domain/events/video-comment-added.event';
import { IncreaseAmountOfCommentsUseCase } from '@videos/videos/application/increase-amount-of-comments/increase-amount-of-comments.use-case';

import { inject, injectable } from 'tsyringe';

@injectable()
export class IncreaseAmountOfCommentsHandler implements DomainHandler<void> {
    constructor(
        @inject(IncreaseAmountOfCommentsUseCase)
        private readonly useCase: IncreaseAmountOfCommentsUseCase
    ) {}

    async handle(event: DomainEvent) {
        const videoEvent = event as VideoCommentAddedEvent;
        const commentId = videoEvent.commentId;
        await this.useCase.execute({ videoId: videoEvent.videoId, commentId });
    }
}
