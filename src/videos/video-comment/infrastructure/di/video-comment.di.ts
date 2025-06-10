import { VIDEO_COMMENT_TOKENS } from '@videos/video-comment/infrastructure/di/video-comment.tokens';
import { AddCommentToVideoCommandHandler } from '@videos/video-comment/infrastructure/handlers/command/add-comment-to-video.handler';
import { MongoVideosCommentDB } from '@videos/videos/infrastructure/persistence/mongoose-video-comment.db';

import { container } from 'tsyringe';

export class DIVideoComments {
    constructor(private readonly mongoDB: MongoVideosCommentDB) {}

    public initDI() {
        this.initDBDependencies();
    }

    public initSingletons() {
        container.resolve(AddCommentToVideoCommandHandler);
    }

    private initDBDependencies() {
        container.register(VIDEO_COMMENT_TOKENS.DB_MODEL, {
            useValue: this.mongoDB.getVideoCommentModel(),
        });
    }
}
