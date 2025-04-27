import { InMemoryQueryEventBus } from '@videomatt/shared/infrastructure/event-bus/in-memory-query.event-bus';
import { HttpResponse } from '@videomatt/shared/infrastructure/controllers/http-response';
import { GetVideosDTO } from '@videomatt/videos/videos/domain/dtos/get-videos.dto';
import { DomainError } from '@videomatt/shared/domain/errors/domain.error';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { inject, injectable } from 'tsyringe';
import { Request, Response } from 'express';

@injectable()
export class GetVideosController {
    constructor(@inject(TOKEN.QUERY_EVENT_BUS) private readonly eventBus: InMemoryQueryEventBus) {}

    async execute(req: Request, res: Response) {
        try {
            const userId = req.params.userId;
            const event = new GetVideosDTO(userId);

            const result = await this.eventBus.publish(event);
            return res.status(200).json(result);
        } catch (error) {
            if (error instanceof DomainError) {
                return HttpResponse.domainError(res, error, 400);
            }
            return HttpResponse.internalServerError(res);
        }
    }
}
