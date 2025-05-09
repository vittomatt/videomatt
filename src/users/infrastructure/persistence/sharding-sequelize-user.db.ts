import { PostgresUserDB } from './sequelize-user.db';

import * as crypto from 'crypto';

export const USER_DB_SHARD_NAMES = ['shard1', 'shard2'];

export class ShardingSequelizeUserDB {
    private readonly SHARDS: { [key: string]: PostgresUserDB };

    constructor(
        private readonly shard1: PostgresUserDB,
        private readonly shard2: PostgresUserDB
    ) {
        this.SHARDS = {
            shard1: this.shard1,
            shard2: this.shard2,
        };
    }

    public getShard(shardName: string): PostgresUserDB {
        return this.SHARDS[shardName];
    }

    public getAllShards(): PostgresUserDB[] {
        return Object.values(this.SHARDS);
    }

    public getShardName(userId: string): string {
        const hash = crypto.createHash('sha256').update(userId).digest('hex');
        const hashInt = parseInt(hash.slice(0, 8), 16);
        const index = hashInt % USER_DB_SHARD_NAMES.length;
        return USER_DB_SHARD_NAMES[index];
    }
}
