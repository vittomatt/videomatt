import { validateDto } from '@shared/infrastructure/controllers/validator';
import { CreateUserController } from '@users/infrastructure/controllers/create-user/create-user.controller';
import {
    CreateUserBodyValidatorDto,
    CreateUserParamValidatorDto,
} from '@users/infrastructure/controllers/create-user/create-user.validator';
import { GetUsersController } from '@users/infrastructure/controllers/get-users/get-users.controller';
import { USER_TOKEN } from '@users/infrastructure/di/user.tokens';

import { Express } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { inject, injectable } from 'tsyringe';

@injectable()
export class UserRoutes {
    constructor(
        @inject(USER_TOKEN.CREATE_USER_CONTROLLER) private readonly controller: CreateUserController,
        @inject(USER_TOKEN.GET_USERS_CONTROLLER) private readonly getUsersController: GetUsersController
    ) {}

    public initRoutes(app: Express) {
        app.put(
            '/api/users/:userId',
            validateDto(CreateUserParamValidatorDto, 'params'),
            validateDto(CreateUserBodyValidatorDto, 'body'),
            expressAsyncHandler(async (req, res, next) => {
                await this.controller.execute(req, res);
            })
        );

        app.get(
            '/api/users',
            expressAsyncHandler(async (req, res, next) => {
                await this.getUsersController.execute(req, res);
            })
        );
    }
}
