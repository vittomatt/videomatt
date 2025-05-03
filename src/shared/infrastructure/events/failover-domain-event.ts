import { DomainEvent } from '@shared/domain/event-bus/domain.event';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { FailOverDomainEventsDBModel } from '@shared/infrastructure/models/failover-domain-events.db-model';

import { Logger } from 'pino';
import { QueryTypes, Sequelize } from 'sequelize';
import { inject, injectable } from 'tsyringe';

export const FAILOVER_DOMAIN_EVENTS_TOTAL = 10;

@injectable()
export class DomainEventFailover {
    constructor(
        @inject(TOKEN.DB_INSTANCE) private readonly db: Sequelize,
        @inject(TOKEN.LOGGER) private readonly logger: Logger
    ) {}

    async publish(event: DomainEvent) {
        try {
            const query = `
                INSERT INTO failover_domain_events ("eventId", "eventName", "eventBody")
                VALUES (?, ?, ?)
            `;
            await this.db.query(query, {
                type: QueryTypes.INSERT,
                replacements: [event.id, event.eventName, JSON.stringify(event)],
            });
        } catch (error) {
            this.logger.error(error);
        }
    }

    async consume(total: number = FAILOVER_DOMAIN_EVENTS_TOTAL): Promise<DomainEvent[]> {
        try {
            const eventsQuery = `
                SELECT "eventId", "eventName", "eventBody" 
                FROM failover_domain_events 
                LIMIT ${total}
        `;
            const results = await this.db.query<FailOverDomainEventsDBModel>(eventsQuery, {
                type: QueryTypes.SELECT,
            });

            const deleteQuery = `
            DELETE FROM failover_domain_events 
            LIMIT ${total}
        `;
            await this.db.query(deleteQuery, {
                type: QueryTypes.DELETE,
            });

            const events = results.map((event) => JSON.parse(event.eventBody) as DomainEvent);
            return events;
        } catch (error) {
            this.logger.error(error);
            return [];
        }
    }
}
