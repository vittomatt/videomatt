import { CreateVideoReadUseCase } from '@videomatt/videos/videos/application/publish-video/create-video-read.use-case';
import { VideoPublishedEvent } from '@videomatt/videos/videos/domain/events/video-published.event';
import { VIDEO_TOKENS } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain-event';
import { Handler } from '@videomatt/shared/domain/broker/handler';
import { inject, injectable } from 'tsyringe';

@injectable()
export class CreateVideoReadOnVideoPublishedHandler implements Handler {
    constructor(
        @inject(VIDEO_TOKENS.CREATE_VIDEO_READ_USE_CASE)
        private readonly useCase: CreateVideoReadUseCase
    ) {}

    async handle(event: DomainEvent) {
        const videoEvent = event as VideoPublishedEvent;
        await this.useCase.execute({
            id: videoEvent.id,
            title: videoEvent.title,
            description: videoEvent.description,
            url: videoEvent.url,
            userId: videoEvent.userId,
        });
    }
}
