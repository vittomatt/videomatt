import { CreateVideoUseCase } from '@videomatt/videos/videos/application/create-video/create-video.use-case';
import { VideoPublishedEvent } from '@videomatt/videos/videos/domain/events/video-published.event';
import { VIDEO_TOKEN } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { CommandHandler } from '@videomatt/shared/domain/event-bus/command.handler';
import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain-event';
import { inject, injectable } from 'tsyringe';

@injectable()
export class CreateVideoHandler implements CommandHandler {
    constructor(
        @inject(VIDEO_TOKEN.PUBLISH_VIDEO_USE_CASE)
        private readonly useCase: CreateVideoUseCase
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
