import { inject, injectable } from 'tsyringe';

import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain-event';
import { Handler } from '@videomatt/shared/domain/broker/handler';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { IncreaseAmountOfVideosUseCase } from '@videomatt/users/application/increase-amount-of-videos.use-case';
import { VideoCreatedEvent } from '@videomatt/videos/domain/events/video-created.event';

@injectable()
export class UserHandler implements Handler {
    constructor(
        @inject(TOKEN.USER.INCREASE_AMOUNT_OF_VIDEOS_USE_CASE)
        private readonly increaseAmountOfVideosUseCase: IncreaseAmountOfVideosUseCase
    ) {}

    async handle(event: DomainEvent) {
        const videoCreatedEvent = event as VideoCreatedEvent;
        const userId = videoCreatedEvent.userId;
        await this.increaseAmountOfVideosUseCase.execute(userId);
    }
}
