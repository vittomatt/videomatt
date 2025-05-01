import { VIDEO_TABLE_NAME } from '@videos/videos/infrastructure/models/video.db-model';
import { PostgresVideosDB } from '@videos/videos/infrastructure/persistence/sequelize-videos.db';

import { DataTypes, Model, Sequelize } from 'sequelize';

export const VIDEO_COMMENT_TABLE_NAME = 'comments';

export class VideoCommentDBModel extends Model {
    public id!: string;
    public text!: string;
    public videoId!: string;
    public userId!: string;

    public static initModel(sequelize: Sequelize): typeof VideoCommentDBModel {
        return VideoCommentDBModel.init(
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

    public static associate(models: PostgresVideosDB) {
        this.belongsTo(models.getVideoModel(), { foreignKey: 'videoId' });
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
