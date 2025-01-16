import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';

import { TOKEN } from '@videomatt/shared/di/tokens';
import { CreateVideoUseCase } from '@videomatt/videos/application/create-video.usecase';

@injectable()
export class CreateVideoController {
    constructor(@inject(TOKEN.CREATE_VIDEO_USE_CASE) private createVideo: CreateVideoUseCase) {}

    async execute(req: Request, res: Response) {
        const { videoTitle, videoDescription, videoUrl } = req.body;
        const uuid = uuidv4();
        await this.createVideo.execute(uuid, videoTitle, videoDescription, videoUrl);
        res.status(201).send('Video created');
    }
}
