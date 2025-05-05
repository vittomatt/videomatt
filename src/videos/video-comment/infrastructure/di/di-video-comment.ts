import { AddCommentToVideoUseCase } from '@videos/video-comment/application/add-comment-to-video/add-comment-to-video.use-case';
import { AddCommentToVideoController } from '@videos/video-comment/infrastructure/controllers/add-comment-to-video/add-comment-to-video.controller';
import { VIDEO_COMMENT_TOKENS } from '@videos/video-comment/infrastructure/di/tokens-video-comment';
import { AddCommentToVideoHandler } from '@videos/video-comment/infrastructure/handlers/command/add-comment-to-video.handler';
import { MongoVideosCommentDB } from '@videos/videos/infrastructure/persistence/mongoose-video-comment.db';

import { container } from 'tsyringe';

export class DIVideoComments {
    constructor(private readonly mongoDB: MongoVideosCommentDB) {}

    public initDI() {
        this.initDBDependencies();
        this.initControllersDependencies();
        this.initUseCasesDependencies();
        this.initHandlersDependencies();
    }

    public initSingletons() {
        container.resolve(VIDEO_COMMENT_TOKENS.ADD_COMMENT_TO_VIDEO_HANDLER);
    }

    private initDBDependencies() {
        container.register(VIDEO_COMMENT_TOKENS.DB_MODEL, {
            useValue: this.mongoDB.getVideoCommentModel(),
        });
    }

    private initControllersDependencies() {
        container.register(VIDEO_COMMENT_TOKENS.ADD_COMMENT_TO_VIDEO_CONTROLLER, {
            useClass: AddCommentToVideoController,
        });
    }

    private initUseCasesDependencies() {
        container.register(VIDEO_COMMENT_TOKENS.ADD_COMMENT_TO_VIDEO_USE_CASE, {
            useClass: AddCommentToVideoUseCase,
        });
    }

    private initHandlersDependencies() {
        container.register(VIDEO_COMMENT_TOKENS.ADD_COMMENT_TO_VIDEO_HANDLER, {
            useClass: AddCommentToVideoHandler,
        });
    }
}
