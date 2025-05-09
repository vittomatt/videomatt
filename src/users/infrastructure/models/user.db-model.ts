import { UserPrimitives } from '@users/domain/models/user';
import { PostgresUserDB } from '@users/infrastructure/persistence/sequelize-user.db';

import { DataTypes, Model, Sequelize } from 'sequelize';

export const USER_TABLE_NAME = 'users';

export class UserDBModel extends Model {
    public id!: string;
    public firstName!: string;
    public lastName!: string;
    public amountOfVideos!: number;

    public static initModel(sequelize: Sequelize): typeof UserDBModel {
        return UserDBModel.init(
            {
                id: {
                    type: DataTypes.UUID,
                    primaryKey: true,
                },
                firstName: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                lastName: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                amountOfVideos: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 0,
                },
                createdAt: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: new Date().toISOString(),
                },
                updatedAt: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: new Date().toISOString(),
                },
            },
            { sequelize, modelName: USER_TABLE_NAME }
        );
    }

    public static associate(models: PostgresUserDB) {}

    toPrimitives(): UserPrimitives {
        return {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            amountOfVideos: this.amountOfVideos,
        };
    }
}
