import { Sequelize } from 'sequelize';

import { Video } from '@videomatt/videos/infrastructure/models/db-video';

export function initModels(sequelize: Sequelize) {
    Video.initModel(sequelize);
}
