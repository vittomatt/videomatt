import { AddCommentToVideoUseCase } from '@videos/video-comment/application/add-comment-to-video/add-comment-to-video.use-case';
import { AddCommentToVideoController } from '@videos/video-comment/infrastructure/controllers/add-comment-to-video/add-comment-to-video.controller';
import { VIDEO_COMMENT_TOKENS } from '@videos/video-comment/infrastructure/di/tokens-video-comment';
import { AddCommentToVideoHandler } from '@videos/video-comment/infrastructure/handlers/command/add-comment-to-video.handler';
import { PostgresVideosDB } from '@videos/videos/infrastructure/persistence/sequelize-videos.db';

import { container } from 'tsyringe';

export class DIVideoComments {
    constructor(private readonly db: PostgresVideosDB) {}

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
            useValue: this.db.getVideoCommentModel(),
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
