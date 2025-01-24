import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { PublishVideoUseCase } from '@videomatt/videos/application/publish-video.use-case';

@injectable()
export class PublishVideoController {
    constructor(@inject(TOKEN.VIDEO.PUBLISH_VIDEO_USE_CASE) private useCase: PublishVideoUseCase) {}

    async execute(req: Request, res: Response) {
        const { id } = req.params;
        const { title, description, url, userId } = req.body;
        await this.useCase.execute(id, title, description, url, userId);
        res.status(201).send('Video published');
    }
}
