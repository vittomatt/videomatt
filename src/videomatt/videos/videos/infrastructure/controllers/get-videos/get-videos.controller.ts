import { InMemoryQueryEventBus } from '@videomatt/shared/infrastructure/event-bus/in-memory-query-event-bus';
import { VideoRead } from '@videomatt/videos/videos/domain/models/read/video.read';
import { GetVideosDTO } from '@videomatt/videos/videos/domain/dtos/get-videos.dto';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { inject, injectable } from 'tsyringe';
import { Request, Response } from 'express';

@injectable()
export class GetVideosController {
    constructor(@inject(TOKEN.QUERY_EVENT_BUS) private readonly eventBus: InMemoryQueryEventBus<VideoRead[]>) {}

    async execute(req: Request, res: Response) {
        const userId = req.params.userId;

        const event = new GetVideosDTO(userId);
        const videos = await this.eventBus.publish(event);

        res.status(201).json(videos);
    }
}
