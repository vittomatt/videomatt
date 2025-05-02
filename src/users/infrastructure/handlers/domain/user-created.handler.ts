import { DomainHandler } from '@shared/domain/broker/domain-handler';
import { DomainEvent } from '@shared/domain/event-bus/domain.event';
import { Logger } from '@shared/domain/logger/logger';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { UserCreatedEvent } from '@users/domain/events/user-created.event';

import { inject, injectable } from 'tsyringe';

@injectable()
export class UserCreatedHandler implements DomainHandler<void> {
    constructor(@inject(TOKEN.LOGGER) private readonly logger: Logger) {}

    async handle(event: DomainEvent) {
        const userEvent = event as UserCreatedEvent;
        this.logger.info(`User created: ${userEvent.id}, ${userEvent.firstName}, ${userEvent.lastName}`);
    }
}
