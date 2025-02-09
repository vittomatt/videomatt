import { CreateVideoReadHandler } from '@videomatt/videos/videos/infrastructure/handlers/domain/create-video-read.handler';
import { LocalEventSubscriber } from '@videomatt/shared/domain/broker/local-event.subscriber';
import { VIDEO_TOKEN } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain-event';
import { inject, injectable } from 'tsyringe';

@injectable()
export class InMemoryEventVideoCreatedSubscriber implements LocalEventSubscriber {
    constructor(
        @inject(VIDEO_TOKEN.CREATE_VIDEO_READ_HANDLER)
        private readonly handler: CreateVideoReadHandler
    ) {}

    async consume(event: DomainEvent): Promise<void> {
        this.handler.handle(event);
    }
}
