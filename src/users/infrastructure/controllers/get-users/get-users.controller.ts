import { TOKEN } from '@shared/infrastructure/di/tokens';
import { InMemoryQueryEventBus } from '@shared/infrastructure/event-bus/in-memory-query.event-bus';
import { GetUsersDTO } from '@users/domain/dtos/get-users.dto';

import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get users
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *       400:
 *         description: Domain error
 *       500:
 *         description: Internal server error
 */
@injectable()
export class GetUsersController {
    constructor(@inject(InMemoryQueryEventBus) private readonly eventBus: InMemoryQueryEventBus) {}

    async execute(req: Request, res: Response) {
        const event = GetUsersDTO.create();
        const result = await this.eventBus.publish(event);
        return res.status(200).json(result);
    }
}
