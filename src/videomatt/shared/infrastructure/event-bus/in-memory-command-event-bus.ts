import { AddCommentToVideoHandler } from '@videomatt/videos/video-comment/infrastructure/handlers/command/add-comment-to-video.hanlder';
import { CreateVideoHandler } from '@videomatt/videos/videos/infrastructure/handlers/domain/create-video.handler';
import { VIDEO_COMMENT_TOKENS } from '@videomatt/videos/video-comment/infrastructure/di/tokens-video-comment';
import { AddCommentToVideoDTO } from '@videomatt/videos/video-comment/domain/dtos/add-comment-to-video.dto';
import { CreateUserHandler } from '@videomatt/users/infrastructure/handlers/command/create-user.handler';
import { CreateVideoDTO } from '@videomatt/videos/videos/domain/dtos/create-video.dto';
import { VIDEO_TOKEN } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { CommandHandler } from '@videomatt/shared/domain/event-bus/command.handler';
import { CreateUserDTO } from '@videomatt/users/domain/dtos/create-user.dto';
import { USER_TOKEN } from '@videomatt/users/infrastructure/di/tokens-user';
import { DTO } from '@videomatt/shared/domain/dtos/dto';
import { inject, injectable } from 'tsyringe';

@injectable()
export class InMemoryCommandEventBus {
    private readonly handlers: Record<string, CommandHandler> = {};

    constructor(
        @inject(VIDEO_TOKEN.CREATE_VIDEO_HANDLER) createVideoHandler: CreateVideoHandler,
        @inject(USER_TOKEN.CREATE_USER_HANDLER) createUserHandler: CreateUserHandler,
        @inject(VIDEO_COMMENT_TOKENS.ADD_COMMENT_TO_VIDEO_HANDLER) addCommentToVideoHandler: AddCommentToVideoHandler
    ) {
        this.handlers[CreateUserDTO.name] = createUserHandler;
        this.handlers[CreateVideoDTO.name] = createVideoHandler;
        this.handlers[AddCommentToVideoDTO.name] = addCommentToVideoHandler;
    }

    async publish(dto: DTO) {
        const handler = this.handlers[dto.constructor.name];
        if (!handler) {
            throw new Error('Handler not found');
        }

        await handler.handle(dto);
    }
}
