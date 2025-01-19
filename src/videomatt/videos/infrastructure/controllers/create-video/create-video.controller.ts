import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { CreateVideoUseCase } from '@videomatt/videos/application/create-video.use-case';

@injectable()
export class CreateVideoController {
    constructor(@inject(TOKEN.CREATE_VIDEO_USE_CASE) private createVideo: CreateVideoUseCase) {}

    async execute(req: Request, res: Response) {
        const { id } = req.params;
        const { title, description, url } = req.body;
        await this.createVideo.execute(id, title, description, url);
        res.status(201).send('Video created');
    }
}
