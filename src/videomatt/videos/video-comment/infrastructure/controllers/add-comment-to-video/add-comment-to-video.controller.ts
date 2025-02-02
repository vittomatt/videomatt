import { AddCommentToVideoUseCase } from '@videomatt/videos/video-comment/application/add-comment-to-video/add-comment-to-video.use-case';
import { VIDEO_COMMENT_TOKENS } from '@videomatt/videos/video-comment/infrastructure/di/tokens-video-comment';
import { inject, injectable } from 'tsyringe';
import { Request, Response } from 'express';

@injectable()
export class AddCommentToVideoController {
    constructor(
        @inject(VIDEO_COMMENT_TOKENS.ADD_COMMENT_TO_VIDEO_USE_CASE) private useCase: AddCommentToVideoUseCase
    ) {}

    async execute(req: Request, res: Response) {
        const { commentId, videoId } = req.params;
        const { text, userId } = req.body;
        await this.useCase.execute({ id: commentId, text, videoId, userId });
        res.status(201).send({ commentId });
    }
}
