import asyncHandler from 'express-async-handler';
import { inject, injectable } from 'tsyringe';
import { Express } from 'express';

import {
    CreateUserBodyValidatorDto,
    CreateUserParamValidatorDto,
} from '@videomatt/users/infrastructure/controllers/create-user.validator';
import { CreateUserController } from '@videomatt/users/infrastructure/controllers/create-user.controller';
import { validateDto } from '@videomatt/shared/infrastructure/controllers/validator';
import { USER_TOKEN } from '@videomatt/users/infrastructure/di/tokens-user';

@injectable()
export class UserRoutes {
    constructor(@inject(USER_TOKEN.CREATE_USER_CONTROLLER) private readonly controller: CreateUserController) {}

    public initRoutes(app: Express) {
        app.put(
            '/api/users/:userId',
            validateDto(CreateUserParamValidatorDto, 'params'),
            validateDto(CreateUserBodyValidatorDto, 'body'),
            asyncHandler(async (req, res, next) => {
                await this.controller.execute(req, res);
            })
        );
    }
}
