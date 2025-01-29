import { IncreaseAmountOfVideosUseCase } from '@videomatt/users/application/increase-amount-of-videos.use-case';
import { VideoPublishedEvent } from '@videomatt/videos/videos/domain/events/video-published.event';
import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain-event';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { Handler } from '@videomatt/shared/domain/broker/handler';
import { inject, injectable } from 'tsyringe';

@injectable()
export class IncreaseAmountOfVideosOnVideoPublishedHandler implements Handler {
    constructor(
        @inject(TOKEN.USER.INCREASE_AMOUNT_OF_VIDEOS_USE_CASE)
        private readonly useCase: IncreaseAmountOfVideosUseCase
    ) {}

    async handle(event: DomainEvent) {
        const videoEvent = event as VideoPublishedEvent;
        const userId = videoEvent.userId;
        await this.useCase.execute(userId);
    }
}
