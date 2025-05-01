import { validateDto } from '@shared/infrastructure/controllers/validator';
import { CreateUserController } from '@users/infrastructure/controllers/create-user.controller';
import {
    CreateUserBodyValidatorDto,
    CreateUserParamValidatorDto,
} from '@users/infrastructure/controllers/create-user.validator';
import { USER_TOKEN } from '@users/infrastructure/di/tokens-user';

import { Express } from 'express';
import asyncHandler from 'express-async-handler';
import { inject, injectable } from 'tsyringe';

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
