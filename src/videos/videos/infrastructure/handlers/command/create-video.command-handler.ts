import { CommandHandler } from '@shared/domain/event-bus/command.handler';
import { DomainEvent } from '@shared/domain/event-bus/domain.event';
import { VideoCreatedEvent } from '@shared/domain/events/video-created.event';
import { InMemoryCommandEventBus } from '@shared/infrastructure/event-bus/in-memory-command.event-bus';
import { CreateVideoUseCase } from '@videos/videos/application/create-video/create-video.use-case';
import { CreateVideoDTO } from '@videos/videos/domain/dtos/create-video.dto';
import { VideoAlreadyExistsError } from '@videos/videos/domain/errors/video-already-exists.error';

import { inject, injectable } from 'tsyringe';

@injectable()
export class CreateVideoCommandHandler implements CommandHandler<VideoAlreadyExistsError> {
    constructor(
        @inject(CreateVideoUseCase)
        private readonly useCase: CreateVideoUseCase,
        @inject(InMemoryCommandEventBus)
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
