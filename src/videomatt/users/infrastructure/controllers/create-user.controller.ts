import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { CreateUserUseCase } from '@videomatt/users/application/create-user.user-case';

@injectable()
export class CreateUserController {
    constructor(@inject(TOKEN.USER.CREATE_USER_USE_CASE) private useCase: CreateUserUseCase) {}

    async execute(req: Request, res: Response) {
        const { id } = req.params;
        const { firstName, lastName } = req.body;
        await this.useCase.execute(id, firstName, lastName);
        res.status(201).send(`User created: ${id}`);
    }
}
