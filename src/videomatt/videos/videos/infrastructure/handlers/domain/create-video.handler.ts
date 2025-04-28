import { inject, injectable } from 'tsyringe';

import { CommandHandler } from '@videomatt/shared/domain/event-bus/command.handler';
import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain.event';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { InMemoryCommandEventBus } from '@videomatt/shared/infrastructure/event-bus/in-memory-command.event-bus';
import { CreateVideoUseCase } from '@videomatt/videos/videos/application/create-video/create-video.use-case';
import { CreateVideoDTO } from '@videomatt/videos/videos/domain/dtos/create-video.dto';
import { VideoAlreadyExistsError } from '@videomatt/videos/videos/domain/errors/video-already-exists.error';
import { VideoCreatedEvent } from '@videomatt/videos/videos/domain/events/video-created.event';
import { VIDEO_TOKEN } from '@videomatt/videos/videos/infrastructure/di/tokens-video';

@injectable()
export class CreateVideoHandler implements CommandHandler<VideoAlreadyExistsError> {
    constructor(
        @inject(VIDEO_TOKEN.PUBLISH_VIDEO_USE_CASE)
        private readonly useCase: CreateVideoUseCase,
        @inject(TOKEN.COMMAND_EVENT_BUS)
        private readonly eventBus: InMemoryCommandEventBus
    ) {
        this.eventBus.registerHandler(CreateVideoDTO.type, this);
    }

    async handle(event: DomainEvent): Promise<VideoAlreadyExistsError | void> {
        const videoEvent = event as VideoCreatedEvent;
        return this.useCase.execute({
            id: videoEvent.id,
            title: videoEvent.title,
            description: videoEvent.description,
            url: videoEvent.url,
            userId: videoEvent.userId,
        });
    }
}
