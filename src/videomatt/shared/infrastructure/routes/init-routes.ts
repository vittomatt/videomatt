import { ErrorController } from '@videomatt/shared/infrastructure/controllers/error.controller';
import { VideoRoutes } from '@videomatt/videos/videos/infrastructure/routes/video.routes';
import { UserRoutes } from '@videomatt/users/infrastructure/routes/user.routes';
import { container } from 'tsyringe';
import { Express } from 'express';

export function initRoutes(app: Express) {
    container.resolve(VideoRoutes).initRoutes(app);
    container.resolve(UserRoutes).initRoutes(app);

    const errorController = container.resolve(ErrorController);
    app.use(errorController.execute.bind(errorController));
}
