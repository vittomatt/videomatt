import { Sequelize } from 'sequelize';

import { DBVideo } from '@videomatt/videos/infrastructure/models/db-video';

export function initModels(sequelize: Sequelize) {
    DBVideo.initModel(sequelize);
}
