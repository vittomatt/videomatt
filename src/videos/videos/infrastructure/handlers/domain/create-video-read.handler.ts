import { DomainHandler } from '@shared/domain/broker/domain-handler';
import { DomainEvent } from '@shared/domain/event-bus/domain.event';
import { CreateVideoReadUseCase } from '@videos/videos/application/create-video/create-video-read.use-case';
import { VideoCreatedEvent } from '@videos/videos/domain/events/video-created.event';
import { VIDEO_TOKEN } from '@videos/videos/infrastructure/di/tokens-video';

import { inject, injectable } from 'tsyringe';

@injectable()
export class CreateVideoReadHandler implements DomainHandler<void> {
    constructor(
        @inject(VIDEO_TOKEN.CREATE_VIDEO_READ_USE_CASE)
        private readonly useCase: CreateVideoReadUseCase
    ) {}

    async handle(event: DomainEvent) {
        const videoEvent = event as VideoCreatedEvent;
        await this.useCase.execute({
            id: videoEvent.id,
            title: videoEvent.title,
            description: videoEvent.description,
            url: videoEvent.url,
            userId: videoEvent.userId,
        });
    }
}
