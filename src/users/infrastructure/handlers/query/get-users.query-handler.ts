import { DTO } from '@shared/domain/dtos/dto';
import { QueryHandler } from '@shared/domain/event-bus/query.handler';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { InMemoryQueryEventBus } from '@shared/infrastructure/event-bus/in-memory-query.event-bus';
import { GetUsersUseCase } from '@users/application/get-users/get-users.use-case';
import { GetUsersDTO } from '@users/domain/dtos/get-users.dto';
import { USER_TOKEN } from '@users/infrastructure/di/user.tokens';
import { UserDTO } from '@users/infrastructure/dtos/user.dto';

import { inject, injectable } from 'tsyringe';

@injectable()
export class GetUsersQueryHandler implements QueryHandler<UserDTO[]> {
    constructor(
        @inject(USER_TOKEN.GET_USERS_USE_CASE)
        private readonly useCase: GetUsersUseCase,
        @inject(TOKEN.QUERY_EVENT_BUS)
        private readonly queryEventBus: InMemoryQueryEventBus
    ) {
        this.queryEventBus.registerHandler(GetUsersDTO.type, this);
    }

    async handle(dto: DTO): Promise<UserDTO[]> {
        const users = await this.useCase.execute();
        const userDTOs = users.map((user) => UserDTO.create({ ...user.toPrimitives() }));
        return userDTOs;
    }
}
