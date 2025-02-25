import { AddCommentToVideoHandler } from '@videomatt/videos/video-comment/infrastructure/handlers/command/add-comment-to-video.hanlder';
import { CreateVideoHandler } from '@videomatt/videos/videos/infrastructure/handlers/domain/create-video.handler';
import { VIDEO_COMMENT_TOKENS } from '@videomatt/videos/video-comment/infrastructure/di/tokens-video-comment';
import { CommandHandlerMapping } from '@videomatt/shared/infrastructure/event-bus/command-handler-mapping';
import { CreateUserHandler } from '@videomatt/users/infrastructure/handlers/command/create-user.handler';
import { VIDEO_TOKEN } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { CommandHandler } from '@videomatt/shared/domain/event-bus/command.handler';
import { USER_TOKEN } from '@videomatt/users/infrastructure/di/tokens-user';
import { BaseDTO } from '@videomatt/shared/domain/dtos/dto';
import { inject, injectable } from 'tsyringe';
import { Either } from 'fp-ts/lib/Either';

@injectable()
export class InMemoryCommandEventBus {
    private readonly handlers: {
        [K in keyof CommandHandlerMapping]: CommandHandler<CommandHandlerMapping[K]['error']>;
    };

    constructor(
        @inject(USER_TOKEN.CREATE_USER_HANDLER) createUserHandler: CreateUserHandler,
        @inject(VIDEO_TOKEN.CREATE_VIDEO_HANDLER) createVideoHandler: CreateVideoHandler,
        @inject(VIDEO_COMMENT_TOKENS.ADD_COMMENT_TO_VIDEO_HANDLER) addCommentToVideoHandler: AddCommentToVideoHandler
    ) {
        this.handlers = {
            CreateUserDTO: createUserHandler,
            CreateVideoDTO: createVideoHandler,
            AddCommentToVideoDTO: addCommentToVideoHandler,
        };
    }

    async publish<T extends BaseDTO>(dto: T): Promise<Either<CommandHandlerMapping[T['type']]['error'], void>> {
        const handler = this.handlers[dto.type] as CommandHandler<CommandHandlerMapping[T['type']]['error']>;
        if (!handler) {
            throw new Error('Handler not found');
        }
        return await handler.handle(dto);
    }
}
