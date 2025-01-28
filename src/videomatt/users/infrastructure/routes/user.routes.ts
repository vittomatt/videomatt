import {
    CreateUserBodyValidatorDto,
    CreateUserParamValidatorDto,
} from '@videomatt/users/infrastructure/controllers/create-user.validator';
import { CreateUserController } from '@videomatt/users/infrastructure/controllers/create-user.controller';
import { validateDto } from '@videomatt/shared/infrastructure/controllers/validator';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { inject, injectable } from 'tsyringe';
import { Express } from 'express';

@injectable()
export class UserRoutes {
    constructor(@inject(TOKEN.USER.CREATE_USER_CONTROLLER) private readonly controller: CreateUserController) {}

    public initRoutes(app: Express) {
        app.put(
            '/api/users/:id',
            validateDto(CreateUserParamValidatorDto, 'params'),
            validateDto(CreateUserBodyValidatorDto, 'body'),
            this.controller.execute.bind(this.controller)
        );
    }
}
