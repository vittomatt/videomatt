import { HttpResponse } from '@shared/infrastructure/controllers/http-response';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { InMemoryCommandEventBus } from '@shared/infrastructure/event-bus/in-memory-command.event-bus';
import { CreateUserDTO } from '@users/domain/dtos/create-user.dto';
import { UserAlreadyExistsError } from '@users/domain/errors/user-already-exists.error';

import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

/**
 * @swagger
 * /users/{userId}:
 *   post:
 *     summary: Create a new user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier for the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   example: usr123
 *       400:
 *         description: User already exists
 *       500:
 *         description: Internal server error
 */
@injectable()
export class CreateUserController {
    constructor(@inject(InMemoryCommandEventBus) private readonly eventBus: InMemoryCommandEventBus) {}

    async execute(req: Request, res: Response) {
        const { userId } = req.params;
        const { firstName, lastName } = req.body;

        const event = CreateUserDTO.create({ id: userId, firstName, lastName });

        const result = await this.eventBus.publish(event);

        if (result instanceof UserAlreadyExistsError) {
            return HttpResponse.domainError(res, result, 400);
        }

        return res.status(201).send({ userId });
    }
}
