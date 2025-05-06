import { HttpResponse } from '@shared/infrastructure/controllers/http-response';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { InMemoryCommandEventBus } from '@shared/infrastructure/event-bus/in-memory-command.event-bus';
import { CreateVideoDTO } from '@videos/videos/domain/dtos/create-video.dto';
import { VideoAlreadyExistsError } from '@videos/videos/domain/errors/video-already-exists.error';

import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

/**
 * @swagger
 * /videos/{videoId}:
 *   post:
 *     summary: Create a new video
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique video id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - url
 *               - userId
 *             properties:
 *               title:
 *                 type: string
 *                 example: How to cook chicken
 *               description:
 *                 type: string
 *                 example: Video tutorial for cooking chicken
 *               url:
 *                 type: string
 *                 example: https://miapi.com/videos/chicken.mp4
 *               userId:
 *                 type: string
 *                 example: 123e4567-e89b-12d3-a456-426614174000
 *     responses:
 *       201:
 *         description: Video created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 videoId:
 *                   type: string
 *                   example: abc123
 *       400:
 *         description: The video already exists
 *       500:
 *         description: Internal server error
 */
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
