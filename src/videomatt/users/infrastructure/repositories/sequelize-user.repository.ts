import { SequelizeCriteriaConverter } from '@videomatt/shared/infrastructure/repositories/sequelize-criteria.converter';
import { UserRepository } from '@videomatt/users/domain/repositories/user.repository';
import { TOKEN as TOKEN_USER } from '@videomatt/users/infrastructure/di/tokens-user';
import { UserDBModel } from '@videomatt/users/infrastructure/models/user.db-model';
import { Criteria } from '@videomatt/shared/domain/repositories/criteria';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { User } from '@videomatt/users/domain/models/write/user';
import { Logger } from '@videomatt/shared/domain/logger/logger';
import { inject, injectable } from 'tsyringe';

@injectable()
export class SequelizeUserRepository implements UserRepository<User> {
    constructor(
        @inject(TOKEN_USER.DB_MODEL) private readonly dbUser: typeof UserDBModel,
        @inject(TOKEN.LOGGER) private readonly logger: Logger
    ) {}

    async add(user: User) {
        try {
            const userPrimitives = user.toPrimitives();
            this.dbUser.create(userPrimitives);
        } catch (error) {
            this.logger.error(`Error adding user: ${error}`);
        }
    }

    async remove(user: User) {
        const id = user.id.value;
        try {
            this.dbUser.destroy({ where: { id } });
        } catch (error) {
            this.logger.error(`Error removing user: ${error}`);
        }
    }

    async update(user: User) {
        const userPrimitives = user.toPrimitives();
        try {
            await this.dbUser.update(userPrimitives, { where: { id: userPrimitives.id } });
        } catch (error) {
            this.logger.error(`Error updating user:: ${error}`);
        }
    }

    async search(criteria: Criteria): Promise<User[]> {
        try {
            const users = await this.convert(criteria);
            return users;
        } catch (error) {
            this.logger.error(`Error searching users: ${error}`);
            return [];
        }
    }

    private async convert(criteria: Criteria): Promise<User[]> {
        const converter = new SequelizeCriteriaConverter(criteria);
        const { where, order, offset, limit } = converter.build();

        const dbUsers = await this.dbUser.findAll({
            where,
            order,
            offset,
            limit,
        });

        const users = dbUsers.map((user) => user.toPrimitives()).map((user) => User.fromPrimitives(user));
        return users;
    }
}
