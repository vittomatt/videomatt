import { Express } from 'express';
import { inject, injectable } from 'tsyringe';

import { TOKEN } from '@videomatt/shared/di/tokens';
import { CreateVideoController } from '@videomatt/videos/infrastructure/controllers/create-video.controller';

@injectable()
export class VideoRoutes {
    constructor(@inject(TOKEN.CREATE_VIDEO_CONTROLLER) private readonly createVideoController: CreateVideoController) {}

    public initRoutes(app: Express) {
        app.post('/api/videos', this.createVideoController.execute.bind(this.createVideoController));
    }
}
