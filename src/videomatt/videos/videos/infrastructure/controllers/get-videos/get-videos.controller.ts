import { GetVideosUseCase } from '@videomatt/videos/videos/application/get-videos.use-case';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { inject, injectable } from 'tsyringe';
import { Request, Response } from 'express';

@injectable()
export class GetVideosController {
    constructor(@inject(TOKEN.VIDEO.GET_VIDEOS_USE_CASE) private useCase: GetVideosUseCase) {}

    async execute(req: Request, res: Response) {
        const videos = await this.useCase.execute();
        const videosPrimitives = videos.map((video) => video.toPrimitives());
        res.status(201).json(videosPrimitives);
    }
}
