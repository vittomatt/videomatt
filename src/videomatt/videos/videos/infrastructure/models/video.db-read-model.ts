import { DataTypes, Model, Sequelize } from 'sequelize';

import { PostgresDB } from '@videomatt/shared/infrastructure/persistence/sequelize-db';
import { USER_TABLE_NAME } from '@videomatt/users/infrastructure/models/user.db-model';

export const VIDEO_TABLE_NAME = 'videos_reads';

export class VideoDBModelRead extends Model {
    public id!: string;
    public title!: string;
    public description!: string;
    public url!: string;
    public userId!: string;
    public amountOfComments!: number;

    public static initModel(sequelize: Sequelize): typeof VideoDBModelRead {
        return VideoDBModelRead.init(
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
                amountOfComments: {
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
            { sequelize, modelName: VIDEO_TABLE_NAME }
        );
    }

    public static associate(models: PostgresDB) {
        this.belongsTo(models.getUserModel(), { foreignKey: 'userId' });
    }

    toPrimitives() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            url: this.url,
            userId: this.userId,
            amountOfComments: this.amountOfComments,
        };
    }
}
