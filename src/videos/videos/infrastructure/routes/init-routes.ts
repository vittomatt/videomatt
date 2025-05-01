import { ErrorController } from '@shared/infrastructure/controllers/error.controller';
import { VideoRoutes } from '@videos/videos/infrastructure/routes/video.routes';

import { Express } from 'express';
import { container } from 'tsyringe';

export function initRoutes(app: Express) {
    container.resolve(VideoRoutes).initRoutes(app);

    const errorController = container.resolve(ErrorController);
    app.use(errorController.execute.bind(errorController));
}
