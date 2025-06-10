import { validateDto } from '@shared/infrastructure/controllers/validator';
import { AddCommentToVideoController } from '@videos/video-comment/infrastructure/controllers/add-comment-to-video/add-comment-to-video.controller';
import {
    AddCommentToVideoBodyValidatorDto,
    AddCommentToVideoParamValidatorDto,
} from '@videos/video-comment/infrastructure/controllers/add-comment-to-video/add-comment-to-video.validator';
import { CreateVideoController } from '@videos/videos/infrastructure/controllers/create-video/create-video.controller';
import {
    CreateVideoBodyValidatorDto,
    CreateVideoParamValidatorDto,
} from '@videos/videos/infrastructure/controllers/create-video/create-video.validator';
import { GetVideosController } from '@videos/videos/infrastructure/controllers/get-videos/get-videos.controller';
import { GetVideosParamValidatorDto } from '@videos/videos/infrastructure/controllers/get-videos/get-videos.validator';

import { Express } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { inject, injectable } from 'tsyringe';

@injectable()
export class VideoRoutes {
    constructor(
        @inject(GetVideosController) private readonly getVideosController: GetVideosController,
        @inject(CreateVideoController) private readonly createVideoController: CreateVideoController,
        @inject(AddCommentToVideoController)
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
