import { HttpResponse } from '@shared/infrastructure/controllers/http-response';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { InMemoryCommandEventBus } from '@shared/infrastructure/event-bus/in-memory-command.event-bus';
import { CreateVideoDTO } from '@videos/videos/domain/dtos/create-video.dto';
import { VideoAlreadyExistsError } from '@videos/videos/domain/errors/video-already-exists.error';

import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

@injectable()
export class CreateVideoController {
    constructor(
        @inject(TOKEN.COMMAND_EVENT_BUS)
        private readonly eventBus: InMemoryCommandEventBus
    ) {}

    async execute(req: Request, res: Response) {
        try {
            const { videoId } = req.params;
            const { title, description, url, userId } = req.body;

            const event = CreateVideoDTO.create({ id: videoId, title, description, url, userId });
            const result = await this.eventBus.publish(event);

            if (result instanceof VideoAlreadyExistsError) {
                return HttpResponse.domainError(res, result, 400);
            }

            return res.status(201).send({ videoId });
        } catch (error) {
            return HttpResponse.internalServerError(res);
        }
    }
}
