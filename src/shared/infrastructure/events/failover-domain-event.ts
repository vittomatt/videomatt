import { DomainEvent } from '@shared/domain/event-bus/domain.event';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { ShardingSequelizeUserDB } from '@users/infrastructure/persistence/sharding-sequelize-user.db';

import { Logger } from 'pino';
import { QueryTypes } from 'sequelize';
import { inject, injectable } from 'tsyringe';

export const FAILOVER_DOMAIN_EVENTS_TOTAL = 10;

@injectable()
export class DomainEventFailover {
    constructor(
        @inject(TOKEN.DB) private readonly db: ShardingSequelizeUserDB,
        @inject(TOKEN.LOGGER) private readonly logger: Logger
    ) {}

    async publish(event: DomainEvent) {
        try {
            const query = `
                INSERT INTO failover_domain_events ("eventId", "eventName", "eventBody")
                VALUES (?, ?, ?)
            `;
            const shardName = this.db.getShardName(event.userId);
            const shard = this.db.getShardByName(shardName);
            await shard.getDB().query(query, {
                type: QueryTypes.INSERT,
                replacements: [event.id, event.eventName, JSON.stringify(event)],
            });
        } catch (error) {
            this.logger.error(error);
        }
    }

    async consume(total: number = FAILOVER_DOMAIN_EVENTS_TOTAL): Promise<DomainEvent[]> {
        try {
            const allShards = this.db.getAllShards();

            const results = await Promise.all(
                allShards.map((shard) => {
                    const model = shard.getFailoverDomainEventsModel();
                    return model.findAll({ limit: total });
                })
            );

            const deleteQuery = `
                DELETE FROM failover_domain_events 
                LIMIT ${total}
            `;
            await Promise.all(
                allShards.map((shard) =>
                    shard.getDB().query(deleteQuery, {
                        type: QueryTypes.DELETE,
                    })
                )
            );

            const events = results
                .flat()
                .map((eventInstance) => eventInstance.toPrimitives())
                .map((primitives) => JSON.parse(primitives.eventBody) as DomainEvent);

            return events;
        } catch (error) {
            this.logger.error(error);
            return [];
        }
    }
}
