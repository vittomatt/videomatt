import { AddCommentToVideoController } from '@videomatt/videos/video-comment/infrastructure/controllers/add-comment-to-video/add-comment-to-video.controller';
import { AddCommentToVideoUseCase } from '@videomatt/videos/video-comment/application/add-comment-to-video/add-comment-to-video.use-case';
import { AddCommentToVideoHandler } from '@videomatt/videos/video-comment/infrastructure/handlers/command/add-comment-to-video.hanlder';
import { VIDEO_COMMENT_TOKENS } from '@videomatt/videos/video-comment/infrastructure/di/tokens-video-comment';
import { DBModel } from '@videomatt/shared/infrastructure/persistence/db';
import { container } from 'tsyringe';

export class DIVideoComments {
    constructor(private readonly db: DBModel) {}

    public initDI() {
        this.initDBDependencies();
        this.initControllersDependencies();
        this.initUseCasesDependencies();
        this.initHandlersDependencies();
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
