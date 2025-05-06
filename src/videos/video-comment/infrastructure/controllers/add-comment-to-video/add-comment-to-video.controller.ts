import { HttpResponse } from '@shared/infrastructure/controllers/http-response';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { InMemoryCommandEventBus } from '@shared/infrastructure/event-bus/in-memory-command.event-bus';
import { InMemoryDeferredDomainEventBus } from '@shared/infrastructure/event-bus/in-memory-deferred-domain.event-bus';
import { AddCommentToVideoDTO } from '@videos/video-comment/domain/dtos/add-comment-to-video.dto';
import { VideoNotFoundError } from '@videos/videos/domain/errors/video-not-found.error';

import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

/**
 * @swagger
 * /videos/{videoId}/comments/{commentId}:
 *   post:
 *     summary: Add a comment to a video
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *         description: Video id
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *               - userId
 *             properties:
 *               text:
 *                 type: string
 *                 example: Excellent video, very useful
 *               userId:
 *                 type: string
 *                 example: 321e4567-e89b-12d3-a456-426614174000
 *     responses:
 *       201:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 commentId:
 *                   type: string
 *                   example: cmt456
 *       400:
 *         description: The video was not found
 *       500:
 *         description: Internal server error
 */
@injectable()
export class AddCommentToVideoController {
    constructor(
        @inject(TOKEN.COMMAND_EVENT_BUS)
        private readonly eventBus: InMemoryCommandEventBus,
        @inject(TOKEN.DEFERRED_DOMAIN_EVENT_BUS) private readonly domainEventBus: InMemoryDeferredDomainEventBus
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

            await this.domainEventBus.publishDeferredEvents();

            return res.status(201).send({ commentId });
        } catch (error) {
            return HttpResponse.internalServerError(res);
        }
    }
}
