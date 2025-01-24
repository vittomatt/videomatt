import { DataTypes, Model, Sequelize } from 'sequelize';

export const USER_TABLE_NAME = 'users';

export class DBUser extends Model {
    public id!: string;
    public firstName!: string;
    public lastName!: string;
    public amountOfVideos!: number;

    public static initModel(sequelize: Sequelize): typeof DBUser {
        return DBUser.init(
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

    toPrimitives() {
        return {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            amountOfVideos: this.amountOfVideos,
        };
    }
}
