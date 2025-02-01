import { AddCommentToVideoParamValidatorDto } from '@videomatt/videos/video-comment/infrastructure/controllers/add-comment-to-video/add-comment-to-video.validator';
import { AddCommentToVideoBodyValidatorDto } from '@videomatt/videos/video-comment/infrastructure/controllers/add-comment-to-video/add-comment-to-video.validator';
import { AddCommentToVideoController } from '@videomatt/videos/video-comment/infrastructure/controllers/add-comment-to-video/add-comment-to-video.controller';
import { PublishVideoParamValidatorDto } from '@videomatt/videos/videos/infrastructure/controllers/publish-video/publish-video.validator';
import { PublishVideoBodyValidatorDto } from '@videomatt/videos/videos/infrastructure/controllers/publish-video/publish-video.validator';
import { PublishVideoController } from '@videomatt/videos/videos/infrastructure/controllers/publish-video/publish-video.controller';
import { GetVideosController } from '@videomatt/videos/videos/infrastructure/controllers/get-videos/get-videos.controller';
import { VIDEO_COMMENT_TOKENS } from '@videomatt/videos/video-comment/infrastructure/di/tokens-video-comment';
import { VIDEO_TOKENS } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { validateDto } from '@videomatt/shared/infrastructure/controllers/validator';
import expressAsyncHandler from 'express-async-handler';
import { inject, injectable } from 'tsyringe';
import { Express } from 'express';

@injectable()
export class VideoRoutes {
    constructor(
        @inject(VIDEO_TOKENS.GET_VIDEOS_CONTROLLER) private readonly getVideosController: GetVideosController,
        @inject(VIDEO_TOKENS.PUBLISH_VIDEO_CONTROLLER) private readonly publishVideoController: PublishVideoController,
        @inject(VIDEO_COMMENT_TOKENS.ADD_COMMENT_TO_VIDEO_CONTROLLER)
        private readonly addCommentToVideoController: AddCommentToVideoController
    ) {}

    public initRoutes(app: Express) {
        app.get('/api/videos', expressAsyncHandler(this.getVideosController.execute.bind(this.getVideosController)));
        app.put(
            '/api/videos/:videoId',
            validateDto(PublishVideoParamValidatorDto, 'params'),
            validateDto(PublishVideoBodyValidatorDto, 'body'),
            expressAsyncHandler(this.publishVideoController.execute.bind(this.publishVideoController))
        );
        app.post(
            '/api/videos/:videoId/comments/:commentId',
            validateDto(AddCommentToVideoParamValidatorDto, 'params'),
            validateDto(AddCommentToVideoBodyValidatorDto, 'body'),
            expressAsyncHandler(this.addCommentToVideoController.execute.bind(this.addCommentToVideoController))
        );
    }
}
