import {
    AddCommentToVideoParamValidatorDto,
    AddCommentToVideoBodyValidatorDto,
} from '@videomatt/videos/video-comment/infrastructure/controllers/add-comment-to-video/add-comment-to-video.validator';
import {
    CreateVideoParamValidatorDto,
    CreateVideoBodyValidatorDto,
} from '@videomatt/videos/videos/infrastructure/controllers/create-video/create-video.validator';
import { AddCommentToVideoController } from '@videomatt/videos/video-comment/infrastructure/controllers/add-comment-to-video/add-comment-to-video.controller';
import { CreateVideoController } from '@videomatt/videos/videos/infrastructure/controllers/create-video/create-video.controller';
import { GetVideosParamValidatorDto } from '@videomatt/videos/videos/infrastructure/controllers/get-videos/get-videos.validator';
import { GetVideosController } from '@videomatt/videos/videos/infrastructure/controllers/get-videos/get-videos.controller';
import { VIDEO_COMMENT_TOKENS } from '@videomatt/videos/video-comment/infrastructure/di/tokens-video-comment';
import { VIDEO_TOKEN } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { validateDto } from '@videomatt/shared/infrastructure/controllers/validator';
import expressAsyncHandler from 'express-async-handler';
import { inject, injectable } from 'tsyringe';
import { Express } from 'express';

@injectable()
export class VideoRoutes {
    constructor(
        @inject(VIDEO_TOKEN.GET_VIDEOS_CONTROLLER) private readonly getVideosController: GetVideosController,
        @inject(VIDEO_TOKEN.PUBLISH_VIDEO_CONTROLLER) private readonly createVideoController: CreateVideoController,
        @inject(VIDEO_COMMENT_TOKENS.ADD_COMMENT_TO_VIDEO_CONTROLLER)
        private readonly addCommentToVideoController: AddCommentToVideoController
    ) {}

    public initRoutes(app: Express) {
        app.get(
            '/api/videos/:userId',
            validateDto(GetVideosParamValidatorDto, 'params'),
            expressAsyncHandler(async (req, res, next) => {
                await this.getVideosController.execute(req, res);
            })
        );
        app.put(
            '/api/videos/:videoId',
            validateDto(CreateVideoParamValidatorDto, 'params'),
            validateDto(CreateVideoBodyValidatorDto, 'body'),
            expressAsyncHandler(async (req, res, next) => {
                await this.createVideoController.execute(req, res);
            })
        );
        app.post(
            '/api/videos/:videoId/comments/:commentId',
            validateDto(AddCommentToVideoParamValidatorDto, 'params'),
            validateDto(AddCommentToVideoBodyValidatorDto, 'body'),
            expressAsyncHandler(async (req, res, next) => {
                await this.addCommentToVideoController.execute(req, res);
            })
        );
    }
}
