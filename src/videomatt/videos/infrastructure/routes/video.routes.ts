import { Express } from 'express';
import { inject, injectable } from 'tsyringe';

import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { validateDto } from '@videomatt/shared/infrastructure/controllers/validator';
import { PublishVideoController } from '@videomatt/videos/infrastructure/controllers/publish-video/publish-video.controller';
import {
    PublishVideoBodyValidatorDto,
    PublishVideoParamValidatorDto,
} from '@videomatt/videos/infrastructure/controllers/publish-video/publish-video.validator';

@injectable()
export class VideoRoutes {
    constructor(@inject(TOKEN.VIDEO.PUBLISH_VIDEO_CONTROLLER) private readonly controller: PublishVideoController) {}

    public initRoutes(app: Express) {
        app.put(
            '/api/videos/:id',
            validateDto(PublishVideoParamValidatorDto, 'params'),
            validateDto(PublishVideoBodyValidatorDto, 'body'),
            this.controller.execute.bind(this.controller)
        );
    }
}
