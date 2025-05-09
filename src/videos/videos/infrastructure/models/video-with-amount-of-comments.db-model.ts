import { VideoWithAmountOfCommentsPrimitives } from '@videos/videos/domain/models/video-with-amount-of-comments';
import { PostgresVideosDB } from '@videos/videos/infrastructure/persistence/sequelize-videos.db';

import { DataTypes, Model, Sequelize } from 'sequelize';

export const VIDEO_TABLE_NAME = 'video_with_amount_of_comments';

export class VideoWithAmountOfCommentsDBModel extends Model {
    public id!: string;
    public title!: string;
    public description!: string;
    public url!: string;
    public userId!: string;
    public amountOfComments!: number;

    public static initModel(sequelize: Sequelize): typeof VideoWithAmountOfCommentsDBModel {
        return VideoWithAmountOfCommentsDBModel.init(
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

    public static associate(models: PostgresVideosDB) {}

    toPrimitives(): VideoWithAmountOfCommentsPrimitives {
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
