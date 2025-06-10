import { PostgresUserDB } from './sequelize-user.db';

import { UnexpectedError } from '@shared/domain/errors/unexpected.error';

import * as crypto from 'crypto';
import { injectable } from 'tsyringe';

const USER_DB_SHARD_NAMES = ['shard1', 'shard2'];

@injectable()
export class ShardingSequelizeUserDB {
    private readonly SHARDS: Record<string, PostgresUserDB> = {};

    public addShard(shardName: string, shard: PostgresUserDB): void {
        this.SHARDS[shardName] = shard;
    }

    public async initShards(): Promise<void> {
        const allShards = this.getAllShards();
        for (const shard of allShards) {
            await shard.initDB();
        }
    }

    public getAllShards(): PostgresUserDB[] {
        const allShards = Object.values(this.SHARDS);
        if (allShards.length === 0) {
            throw new UnexpectedError('No shards found');
        }
        return allShards;
    }

    public getShardByName(shardName: string): PostgresUserDB {
        const shard = this.SHARDS[shardName];
        if (!shard) {
            throw new UnexpectedError(`Shard ${shardName} not found`);
        }
        return shard;
    }

    public getShardName(userId: string): string {
        const hash = crypto.createHash('sha256').update(userId).digest('hex');
        const hashInt = parseInt(hash.slice(0, 8), 16);

        const index = hashInt % USER_DB_SHARD_NAMES.length;

        const shardName = USER_DB_SHARD_NAMES[index];
        const shard = this.getShardByName(shardName);
        if (!shard) {
            throw new UnexpectedError(`Shard ${shardName} not found`);
        }

        return shardName;
    }
}
