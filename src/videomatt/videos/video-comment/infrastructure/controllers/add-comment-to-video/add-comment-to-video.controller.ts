import { InMemoryCommandEventBus } from '@videomatt/shared/infrastructure/event-bus/in-memory-command-event-bus';
import { AddCommentToVideoDTO } from '@videomatt/videos/video-comment/domain/dtos/add-comment-to-video.dto';
import { VideoNotFoundError } from '@videomatt/videos/videos/domain/errors/video-not-found.error';
import { HttpResponse } from '@videomatt/shared/infrastructure/controllers/http-response';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { inject, injectable } from 'tsyringe';
import { Request, Response } from 'express';

@injectable()
export class AddCommentToVideoController {
    constructor(
        @inject(TOKEN.COMMAND_EVENT_BUS)
        private readonly eventBus: InMemoryCommandEventBus
    ) {}

    async execute(req: Request, res: Response) {
        try {
            const { commentId, videoId } = req.params;
            const { text, userId } = req.body;

            const event = AddCommentToVideoDTO.create({ id: commentId, text, videoId, userId });

            const result = await this.eventBus.publish(event);

            if (result instanceof VideoNotFoundError) {
                return HttpResponse.domainError(res, result, 400);
            }

            return res.status(201).send({ commentId });
        } catch (error) {
            return HttpResponse.internalServerError(res);
        }
    }
}
