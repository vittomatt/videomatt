import { PublishVideoUseCase } from '@videomatt/videos/videos/application/publish-video/publish-video.use-case';
import { VIDEO_TOKENS } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { inject, injectable } from 'tsyringe';
import { Request, Response } from 'express';

@injectable()
export class PublishVideoController {
    constructor(@inject(VIDEO_TOKENS.PUBLISH_VIDEO_USE_CASE) private useCase: PublishVideoUseCase) {}

    async execute(req: Request, res: Response) {
        const { videoId } = req.params;
        const { title, description, url, userId } = req.body;
        await this.useCase.execute(videoId, title, description, url, userId);
        res.status(201).send({ videoId });
    }
}
