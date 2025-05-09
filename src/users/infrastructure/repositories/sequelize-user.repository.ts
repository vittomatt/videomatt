import { UnexpectedError } from '@shared/domain/errors/unexpected.error';
import { Logger } from '@shared/domain/logger/logger';
import { Criteria } from '@shared/domain/repositories/criteria';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { SequelizeCriteriaConverter } from '@shared/infrastructure/repositories/sequelize-criteria.converter';
import { User, UserPrimitives } from '@users/domain/models/user';
import { UserRepository } from '@users/domain/repositories/user.repository';
import { USER_TOKEN } from '@users/infrastructure/di/user.tokens';
import { UserDBModel } from '@users/infrastructure/models/user.db-model';

import { Result, errAsync, okAsync } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

@injectable()
export class SequelizeUserRepository implements UserRepository<User> {
    constructor(
        @inject(USER_TOKEN.DB_MODEL) private readonly dbUser: typeof UserDBModel,
        @inject(TOKEN.LOGGER) private readonly logger: Logger
    ) {}

    async add(user: User): Promise<Result<void, UnexpectedError>> {
        try {
            const userPrimitives = user.toPrimitives();
            await this.dbUser.create(userPrimitives);
            return okAsync(undefined);
        } catch (error) {
            this.logger.error(`Error adding user: ${error}`);
            return errAsync(new UnexpectedError('Error adding user'));
        }
    }

    async remove(user: User): Promise<Result<void, UnexpectedError>> {
        const id = user.id.value;

        try {
            await this.dbUser.destroy({ where: { id } });
            return okAsync(undefined);
        } catch (error) {
            this.logger.error(`Error removing user: ${error}`);
            return errAsync(new UnexpectedError('Error removing user'));
        }
    }

    async update(user: User): Promise<Result<void, UnexpectedError>> {
        const userPrimitives = user.toPrimitives();

        try {
            await this.dbUser.update(userPrimitives, { where: { id: userPrimitives.id } });
            return okAsync(undefined);
        } catch (error) {
            this.logger.error(`Error updating user:: ${error}`);
            return errAsync(new UnexpectedError('Error updating user'));
        }
    }

    async search(criteria: Criteria): Promise<Result<UserPrimitives[], UnexpectedError>> {
        try {
            const userPrimitives = await this.findWithCriteria(criteria);
            return okAsync(userPrimitives);
        } catch (error) {
            this.logger.error(`Error searching users: ${error}`);
            return errAsync(new UnexpectedError('Error searching users'));
        }
    }

    async searchById(id: string): Promise<Result<UserPrimitives | null, UnexpectedError>> {
        const user = await this.dbUser.findByPk(id);
        return user ? okAsync(user.toPrimitives()) : errAsync(new UnexpectedError('User not found'));
    }

    private async findWithCriteria(criteria: Criteria): Promise<UserPrimitives[]> {
        const converter = new SequelizeCriteriaConverter(criteria);
        const { where, order, offset, limit } = converter.build();

        const userDBModels = await this.dbUser.findAll({
            where,
            order,
            offset,
            limit,
        });

        return userDBModels.map((user) => user.toPrimitives());
    }
}
