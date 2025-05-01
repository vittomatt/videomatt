import { ErrorController } from '@shared/infrastructure/controllers/error.controller';
import { UserRoutes } from '@users/infrastructure/routes/user.routes';
import { VideoRoutes } from '@videos/videos/infrastructure/routes/video.routes';

import { Express } from 'express';
import { container } from 'tsyringe';

export function initRoutes(app: Express) {
    container.resolve(VideoRoutes).initRoutes(app);
    container.resolve(UserRoutes).initRoutes(app);

    const errorController = container.resolve(ErrorController);
    app.use(errorController.execute.bind(errorController));
}
