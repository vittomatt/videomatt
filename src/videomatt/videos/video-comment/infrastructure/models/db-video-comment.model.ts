import { VIDEO_TABLE_NAME } from '@videomatt/videos/videos/infrastructure/models/db-video.model';
import { USER_TABLE_NAME } from '@videomatt/users/infrastructure/models/db-user.model';
import { DBModels } from '@videomatt/shared/infrastructure/persistence/db-models';
import { DataTypes, Model, Sequelize } from 'sequelize';

export const VIDEO_COMMENT_TABLE_NAME = 'comments';

export class DBVideoComment extends Model {
    public id!: string;
    public text!: string;
    public videoId!: string;
    public userId!: string;

    public static initModel(sequelize: Sequelize): typeof DBVideoComment {
        return DBVideoComment.init(
            {
                id: {
                    type: DataTypes.UUID,
                    primaryKey: true,
                },
                text: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                videoId: {
                    type: DataTypes.UUID,
                    allowNull: false,
                    references: {
                        model: VIDEO_TABLE_NAME,
                        key: 'id',
                    },
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
            { sequelize, modelName: VIDEO_COMMENT_TABLE_NAME }
        );
    }

    public static associate(models: DBModels) {
        this.belongsTo(models.DBVideo!, { foreignKey: 'videoId' });
        this.belongsTo(models.DBUser!, { foreignKey: 'userId' });
    }

    toPrimitives() {
        return {
            id: this.id,
            text: this.text,
            videoId: this.videoId,
            userId: this.userId,
        };
    }
}
