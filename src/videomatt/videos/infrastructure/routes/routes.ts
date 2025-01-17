import { Express } from 'express';
import { inject, injectable } from 'tsyringe';

import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { validateDto } from '@videomatt/shared/infrastructure/controllers/validator';
import { CreateVideoController } from '@videomatt/videos/infrastructure/controllers/create-video/create-video.controller';
import {
    CreateVideoBodyValidatorDto,
    CreateVideoParamValidatorDto,
} from '@videomatt/videos/infrastructure/controllers/create-video/create-video.validator';

@injectable()
export class VideoRoutes {
    constructor(@inject(TOKEN.CREATE_VIDEO_CONTROLLER) private readonly createVideoController: CreateVideoController) {}

    public initRoutes(app: Express) {
        app.put(
            '/api/videos/:id',
            validateDto(CreateVideoParamValidatorDto, 'params'),
            validateDto(CreateVideoBodyValidatorDto, 'body'),
            this.createVideoController.execute.bind(this.createVideoController)
        );
    }
}
