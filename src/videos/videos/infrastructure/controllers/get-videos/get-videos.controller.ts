import { DomainError } from '@shared/domain/errors/domain.error';
import { HttpResponse } from '@shared/infrastructure/controllers/http-response';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { InMemoryQueryEventBus } from '@shared/infrastructure/event-bus/in-memory-query.event-bus';
import { GetVideosDTO } from '@videos/videos/domain/dtos/get-videos.dto';

import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

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
