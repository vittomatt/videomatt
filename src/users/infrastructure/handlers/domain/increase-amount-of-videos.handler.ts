import { DomainHandler } from '@shared/domain/broker/domain-handler';
import { DomainEvent } from '@shared/domain/event-bus/domain.event';
import { VideoCreatedEvent } from '@shared/domain/events/video-created.event';
import { IncreaseAmountOfVideosUseCase } from '@users/application/increase-amount-of-videos/increase-amount-of-videos.use-case';
import { USER_TOKEN } from '@users/infrastructure/di/user.tokens';

import { inject, injectable } from 'tsyringe';

@injectable()
export class IncreaseAmountOfVideosHandler implements DomainHandler<void> {
    constructor(
        @inject(USER_TOKEN.INCREASE_AMOUNT_OF_VIDEOS_USE_CASE)
        private readonly useCase: IncreaseAmountOfVideosUseCase
    ) {}

    async handle(event: DomainEvent) {
        const videoEvent = event as VideoCreatedEvent;
        const userId = videoEvent.userId;
        const videoId = videoEvent.videoId;
        await this.useCase.execute({ userId, videoId });
    }
}
