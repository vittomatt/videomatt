import { USER_TABLE_NAME } from '@videomatt/users/infrastructure/models/db-user.model';
import { DataTypes, Model, Sequelize } from 'sequelize';

export const VIDEO_TABLE_NAME = 'videos';

export class DBVideo extends Model {
    public id!: string;
    public title!: string;
    public description!: string;
    public url!: string;
    public userId!: string;

    public static initModel(sequelize: Sequelize): typeof DBVideo {
        return DBVideo.init(
            {
                id: {
                    type: DataTypes.UUID,
                    primaryKey: true,
                },
                title: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                description: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                url: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                userId: {
                    type: DataTypes.UUID,
                    allowNull: false,
                    references: {
                        model: USER_TABLE_NAME,
                        key: 'id',
                    },
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
            { sequelize, modelName: VIDEO_TABLE_NAME }
        );
    }

    toPrimitives() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            url: this.url,
            userId: this.userId,
        };
    }
}
