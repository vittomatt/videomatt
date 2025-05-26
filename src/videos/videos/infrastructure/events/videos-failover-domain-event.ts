import { DomainEvent } from '@shared/domain/event-bus/domain.event';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { FailoverDomainEvents } from '@shared/infrastructure/events/failover-domain-events';
import { PostgresVideosDB } from '@videos/videos/infrastructure/persistence/sequelize-videos.db';

import { Logger } from 'pino';
import { QueryTypes } from 'sequelize';
import { inject, injectable } from 'tsyringe';

export const FAILOVER_DOMAIN_EVENTS_TOTAL = 10;

@injectable()
export class VideoDomainEventFailover implements FailoverDomainEvents {
    constructor(
        @inject(TOKEN.DB) private readonly db: PostgresVideosDB,
        @inject(TOKEN.LOGGER) private readonly logger: Logger
    ) {}

    async publish(event: DomainEvent) {
        try {
            const query = `
                INSERT INTO failover_domain_events ("eventId", "eventName", "eventBody")
                VALUES (?, ?, ?)
            `;
            await this.db.getDB().query(query, {
                type: QueryTypes.INSERT,
                replacements: [event.id, event.eventName, JSON.stringify(event)],
            });
        } catch (error) {
            this.logger.error(error);
        }
    }

    async consume(total: number = FAILOVER_DOMAIN_EVENTS_TOTAL): Promise<DomainEvent[]> {
        try {
            const results = await this.db.getFailoverDomainEventsModel().findAll({ limit: total });

            const deleteQuery = `
                DELETE FROM failover_domain_events 
                LIMIT ${total}
            `;
            await this.db.getDB().query(deleteQuery, {
                type: QueryTypes.DELETE,
            });

            const events = results.map((eventInstance) => JSON.parse(eventInstance.eventBody) as DomainEvent);

            return events;
        } catch (error) {
            this.logger.error(error);
            return [];
        }
    }
}
