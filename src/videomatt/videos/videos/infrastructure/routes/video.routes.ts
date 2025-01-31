import { AddCommentToVideoParamValidatorDto } from '@videomatt/videos/video-comment/infrastructure/controllers/add-comment-to-video/add-comment-to-video.validator';
import { AddCommentToVideoBodyValidatorDto } from '@videomatt/videos/video-comment/infrastructure/controllers/add-comment-to-video/add-comment-to-video.validator';
import { AddCommentToVideoController } from '@videomatt/videos/video-comment/infrastructure/controllers/add-comment-to-video/add-comment-to-video.controller';
import { PublishVideoParamValidatorDto } from '@videomatt/videos/videos/infrastructure/controllers/publish-video/publish-video.validator';
import { PublishVideoBodyValidatorDto } from '@videomatt/videos/videos/infrastructure/controllers/publish-video/publish-video.validator';
import { PublishVideoController } from '@videomatt/videos/videos/infrastructure/controllers/publish-video/publish-video.controller';
import { TOKEN as TOKEN_VIDEO_COMMENT } from '@videomatt/videos/video-comment/infrastructure/di/tokens-video-comment';
import { TOKEN as TOKEN_VIDEO } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { GetVideosController } from '../controllers/get-videos/get-videos.controller';
import { validateDto } from '@videomatt/shared/infrastructure/controllers/validator';
import { inject, injectable } from 'tsyringe';
import { Express } from 'express';

@injectable()
export class VideoRoutes {
    constructor(
        @inject(TOKEN_VIDEO.GET_VIDEOS_CONTROLLER) private readonly getVideosController: GetVideosController,
        @inject(TOKEN_VIDEO.PUBLISH_VIDEO_CONTROLLER) private readonly publishVideoController: PublishVideoController,
        @inject(TOKEN_VIDEO_COMMENT.ADD_COMMENT_TO_VIDEO_CONTROLLER)
        private readonly addCommentToVideoController: AddCommentToVideoController
    ) {}

    public initRoutes(app: Express) {
        app.get('/api/videos', this.getVideosController.execute.bind(this.getVideosController));
        app.put(
            '/api/videos/:videoId',
            validateDto(PublishVideoParamValidatorDto, 'params'),
            validateDto(PublishVideoBodyValidatorDto, 'body'),
            this.publishVideoController.execute.bind(this.publishVideoController)
        );
        app.put(
            '/api/videos/:videoId/comments/:commentId',
            validateDto(AddCommentToVideoParamValidatorDto, 'params'),
            validateDto(AddCommentToVideoBodyValidatorDto, 'body'),
            this.addCommentToVideoController.execute.bind(this.addCommentToVideoController)
        );
    }
}
