import { InMemoryCommandEventBus } from '@videomatt/shared/infrastructure/event-bus/in-memory-command-event-bus';
import { VideoAlreadyExistsError } from '@videomatt/videos/videos/domain/errors/video-already-exists.error';
import { CreateVideoDTO } from '@videomatt/videos/videos/domain/dtos/create-video.dto';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { inject, injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { match } from 'fp-ts/lib/Either';

@injectable()
export class CreateVideoController {
    constructor(
        @inject(TOKEN.COMMAND_EVENT_BUS)
        private readonly eventBus: InMemoryCommandEventBus
    ) {}

    async execute(req: Request, res: Response) {
        const { videoId } = req.params;
        const { title, description, url, userId } = req.body;

        const event = CreateVideoDTO.create({ id: videoId, title, description, url, userId });
        const result = await this.eventBus.publish(event);

        match(
            (error: VideoAlreadyExistsError) => {
                res.status(400).send({ error: error.message });
            },
            () => {
                res.status(201).send({ videoId });
            }
        )(result);
    }
}
