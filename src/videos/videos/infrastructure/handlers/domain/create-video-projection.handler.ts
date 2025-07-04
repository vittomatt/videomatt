import { DomainHandler } from '@shared/domain/broker/domain-handler';
import { DomainEvent } from '@shared/domain/event-bus/domain.event';
import { VideoCreatedEvent } from '@shared/domain/events/video-created.event';
import { CreateVideoProjection } from '@videos/videos/application/create-video/create-video-projection.use-case';

import { inject, injectable } from 'tsyringe';

@injectable()
export class CreateVideoProjectionHandler implements DomainHandler<void> {
    constructor(
        @inject(CreateVideoProjection)
        private readonly useCase: CreateVideoProjection
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
