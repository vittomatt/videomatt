import { AddCommentToVideoHandler } from '@videomatt/videos/video-comment/infrastructure/handlers/command/add-comment-to-video.hanlder';
import { CreateVideoHandler } from '@videomatt/videos/videos/infrastructure/handlers/domain/create-video.handler';
import { VideoAlreadyExistsError } from '@videomatt/videos/videos/domain/errors/video-already-exists.error';
import { CreateUserHandler } from '@videomatt/users/infrastructure/handlers/command/create-user.handler';
import { VideoNotFoundError } from '@videomatt/videos/videos/domain/errors/video-not-found.error';
import { UserAlreadyExistsError } from '@videomatt/users/domain/errors/user-already-exists.error';

export type CommandHandlerMapping = {
    CreateUserDTO: {
        handler: CreateUserHandler;
        error: UserAlreadyExistsError;
    };
    CreateVideoDTO: {
        handler: CreateVideoHandler;
        error: VideoAlreadyExistsError;
    };
    AddCommentToVideoDTO: {
        handler: AddCommentToVideoHandler;
        error: VideoNotFoundError;
    };
};
