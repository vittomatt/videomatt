import { CommandHandler } from '@shared/domain/event-bus/command.handler';
import { DomainEvent } from '@shared/domain/event-bus/domain.event';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { InMemoryCommandEventBus } from '@shared/infrastructure/event-bus/in-memory-command.event-bus';
import { AddCommentToVideoUseCase } from '@videos/video-comment/application/add-comment-to-video/add-comment-to-video.use-case';
import { AddCommentToVideoDTO } from '@videos/video-comment/domain/dtos/add-comment-to-video.dto';
import { VideoCommentAddedEvent } from '@videos/video-comment/domain/events/video-comment-added.event';
import { VIDEO_COMMENT_TOKENS } from '@videos/video-comment/infrastructure/di/tokens-video-comment';
import { VideoNotFoundError } from '@videos/videos/domain/errors/video-not-found.error';

import { inject, injectable } from 'tsyringe';

@injectable()
export class AddCommentToVideoHandler implements CommandHandler<VideoNotFoundError> {
    constructor(
        @inject(VIDEO_COMMENT_TOKENS.ADD_COMMENT_TO_VIDEO_USE_CASE)
        private readonly useCase: AddCommentToVideoUseCase,
        @inject(TOKEN.COMMAND_EVENT_BUS)
        private readonly eventBus: InMemoryCommandEventBus
    ) {
        this.eventBus.registerHandler(AddCommentToVideoDTO.type, this);
    }

    async handle(event: DomainEvent): Promise<VideoNotFoundError | void> {
        const videoCommentEvent = event as VideoCommentAddedEvent;
        return this.useCase.execute({
            id: videoCommentEvent.id,
            text: videoCommentEvent.text,
            videoId: videoCommentEvent.videoId,
            userId: videoCommentEvent.userId,
        });
    }
}
