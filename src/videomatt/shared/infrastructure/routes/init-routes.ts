import { Express } from 'express';
import { container } from 'tsyringe';

import { UserRoutes } from '@videomatt/users/infrastructure/routes/user.routes';
import { VideoRoutes } from '@videomatt/videos/infrastructure/routes/video.routes';
import { ErrorController } from '@videomatt/shared/infrastructure/controllers/error.controller';

export function initRoutes(app: Express) {
    container.resolve(VideoRoutes).initRoutes(app);
    container.resolve(UserRoutes).initRoutes(app);

    const errorController = container.resolve(ErrorController);
    app.use(errorController.execute.bind(errorController));
}
