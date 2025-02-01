import { GetVideosUseCase } from '@videomatt/videos/videos/application/get-videos/get-videos.use-case';
import { VIDEO_TOKENS } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { inject, injectable } from 'tsyringe';
import { Request, Response } from 'express';

@injectable()
export class GetVideosController {
    constructor(@inject(VIDEO_TOKENS.GET_VIDEOS_USE_CASE) private useCase: GetVideosUseCase) {}

    async execute(req: Request, res: Response) {
        const videos = await this.useCase.execute();
        res.status(201).json(videos);
    }
}
