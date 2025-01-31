import { TOKEN as TOKEN_VIDEO_COMMENT } from '@videomatt/videos/video-comment/infrastructure/di/tokens-video-comment';
import { AddCommentToVideoUseCase } from '@videomatt/videos/video-comment/application/add-comment-to-video.use-case';
import { inject, injectable } from 'tsyringe';
import { Request, Response } from 'express';

@injectable()
export class AddCommentToVideoController {
    constructor(@inject(TOKEN_VIDEO_COMMENT.ADD_COMMENT_TO_VIDEO_USE_CASE) private useCase: AddCommentToVideoUseCase) {}

    async execute(req: Request, res: Response) {
        const { commentId, videoId } = req.params;
        const { text, userId } = req.body;
        await this.useCase.execute(commentId, text, videoId, userId);
        res.status(201).send({ commentId });
    }
}
