import { IncreaseAmountOfVideosUseCase } from '@videomatt/users/application/increase-amount-of-videos/increase-amount-of-videos.use-case';
import { VideoPublishedEvent } from '@videomatt/videos/videos/domain/events/video-published.event';
import { DomainHandler } from '@videomatt/shared/domain/broker/domain-handler';
import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain-event';
import { USER_TOKEN } from '@videomatt/users/infrastructure/di/tokens-user';
import { inject, injectable } from 'tsyringe';

@injectable()
export class IncreaseAmountOfVideosHandler implements DomainHandler<void> {
    constructor(
        @inject(USER_TOKEN.INCREASE_AMOUNT_OF_VIDEOS_USE_CASE)
        private readonly useCase: IncreaseAmountOfVideosUseCase
    ) {}

    async handle(event: DomainEvent) {
        const videoEvent = event as VideoPublishedEvent;
        const userId = videoEvent.userId;
        await this.useCase.execute(userId);
    }
}
