import { AddCommentToVideoController } from '@videomatt/videos/video-comment/infrastructure/controllers/add-comment-to-video/add-comment-to-video.controller';
import { AddCommentToVideoUseCase } from '@videomatt/videos/video-comment/application/add-comment-to-video.use-case';
import { DBModel } from '@videomatt/shared/infrastructure/persistence/db';
import { TOKEN } from './tokens-video-comment';
import { container } from 'tsyringe';

export class DIVideoComments {
    constructor(private readonly db: DBModel) {}

    public initDI() {
        this.initDBDependencies();
        this.initControllersDependencies();
        this.initUseCasesDependencies();
    }

    private initDBDependencies() {
        container.register(TOKEN.DB_MODEL_COMMENT, {
            useValue: this.db.getVideoCommentModel(),
        });
    }

    private initControllersDependencies() {
        container.register(TOKEN.ADD_COMMENT_TO_VIDEO_CONTROLLER, {
            useClass: AddCommentToVideoController,
        });
    }

    private initUseCasesDependencies() {
        container.register(TOKEN.ADD_COMMENT_TO_VIDEO_USE_CASE, {
            useClass: AddCommentToVideoUseCase,
        });
    }
}
