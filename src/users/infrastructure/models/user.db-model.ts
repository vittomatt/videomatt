import { UserPrimitives } from '@users/domain/models/user';

import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize';

export const USER_TABLE_NAME = 'users';

export function defineModel(sequelize: Sequelize) {
    class UserDBModel
        extends Model<InferAttributes<UserDBModel>, InferCreationAttributes<UserDBModel>>
        implements UserPrimitives
    {
        declare id: string;
        declare firstName: string;
        declare lastName: string;
        declare amountOfVideos: number;

        declare createdAt: CreationOptional<Date>;
        declare updatedAt: CreationOptional<Date>;

        toPrimitives(): UserPrimitives {
            return {
                id: this.id,
                firstName: this.firstName,
                lastName: this.lastName,
                amountOfVideos: this.amountOfVideos,
            };
        }
    }

    UserDBModel.init(
        {
            id: { type: DataTypes.UUID, primaryKey: true },
            firstName: { type: DataTypes.STRING, allowNull: false },
            lastName: { type: DataTypes.STRING, allowNull: false },
            amountOfVideos: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
            createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
            updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
        },
        {
            sequelize,
            tableName: USER_TABLE_NAME,
            modelName: USER_TABLE_NAME,
            timestamps: true,
        }
    );

    return UserDBModel;
}
