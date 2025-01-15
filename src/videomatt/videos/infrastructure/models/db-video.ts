import { DataTypes, Model, Sequelize } from 'sequelize';

const VIDEO_TABLE_NAME = 'videos';

export class Video extends Model {
    public id!: string;
    public title!: string;
    public description!: string;
    public url!: string;

    public static initModel(sequelize: Sequelize) {
        Video.init(
            {
                id: {
                    type: DataTypes.UUIDV4,
                    autoIncrement: true,
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
}
