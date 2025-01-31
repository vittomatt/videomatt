import { CreateUserUseCase } from '@videomatt/users/application/create-user.user-case';
import { TOKEN as TOKEN_USER } from '@videomatt/users/infrastructure/di/tokens-user';
import { inject, injectable } from 'tsyringe';
import { Request, Response } from 'express';

@injectable()
export class CreateUserController {
    constructor(@inject(TOKEN_USER.CREATE_USER_USE_CASE) private useCase: CreateUserUseCase) {}

    async execute(req: Request, res: Response) {
        const { userId } = req.params;
        const { firstName, lastName } = req.body;
        await this.useCase.execute(userId, firstName, lastName);
        res.status(201).send({ userId });
    }
}
