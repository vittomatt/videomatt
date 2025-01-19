import { DataTypes, Model, Sequelize } from 'sequelize';

const VIDEO_TABLE_NAME = 'videos';

export class DBVideo extends Model {
    public id!: string;
    public title!: string;
    public description!: string;
    public url!: string;

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
        };
    }
}
