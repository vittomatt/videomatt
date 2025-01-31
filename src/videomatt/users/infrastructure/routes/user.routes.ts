import {
    CreateUserBodyValidatorDto,
    CreateUserParamValidatorDto,
} from '@videomatt/users/infrastructure/controllers/create-user.validator';
import { CreateUserController } from '@videomatt/users/infrastructure/controllers/create-user.controller';
import { validateDto } from '@videomatt/shared/infrastructure/controllers/validator';
import { TOKEN as TOKEN_USER } from '@videomatt/users/infrastructure/di/tokens-user';
import { inject, injectable } from 'tsyringe';
import { Express } from 'express';

@injectable()
export class UserRoutes {
    constructor(@inject(TOKEN_USER.CREATE_USER_CONTROLLER) private readonly controller: CreateUserController) {}

    public initRoutes(app: Express) {
        app.put(
            '/api/users/:userId',
            validateDto(CreateUserParamValidatorDto, 'params'),
            validateDto(CreateUserBodyValidatorDto, 'body'),
            this.controller.execute.bind(this.controller)
        );
    }
}
