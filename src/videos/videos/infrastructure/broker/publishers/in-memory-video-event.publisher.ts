import { LocalEventPublisher } from '@shared/domain/broker/local-event.publisher';
import { LocalEventSubscriber } from '@shared/domain/broker/local-event.subscriber';
import { DomainEventBus } from '@shared/domain/event-bus/domain-event-bus';
import { DomainEvent } from '@shared/domain/event-bus/domain.event';
import { VideoCreatedEvent } from '@shared/domain/events/video-created.event';
import { Logger } from '@shared/domain/logger/logger';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { VideoCommentAddedEvent } from '@videos/video-comment/domain/events/video-comment-added.event';
import { InMemoryEventCommentAddedSubscriber } from '@videos/videos/infrastructure/broker/subscriber/in-memory-event-comment-added.subscriber';
import { InMemoryEventVideoCreatedSubscriber } from '@videos/videos/infrastructure/broker/subscriber/in-memory-event-video-created.subscriber';
import { VIDEO_TOKEN } from '@videos/videos/infrastructure/di/tokens-video';

import { inject, singleton } from 'tsyringe';

@singleton()
export class InMemoryVideoEventPublisher implements LocalEventPublisher {
    private readonly handlers: Record<string, LocalEventSubscriber[]> = {};

    constructor(
        @inject(TOKEN.DOMAIN_EVENT_BUS) protected readonly eventBus: DomainEventBus,
        @inject(TOKEN.LOGGER) protected readonly logger: Logger
    ) {
        this.eventBus.registerLocalPublisher(this);
    }

    registerHandler(event: string, handler: LocalEventSubscriber): void {
        this.handlers[event] = [handler];
    }

    async publish(event: DomainEvent) {
        try {
            // FITU HERE
            const handlers = this.handlers[event.eventName];
            await this.consume(event, handlers || []);
            this.logger.info(`Event ${event.eventName} sent`);
        } catch (error) {
            this.logger.error(`Error publishing event ${event.eventName}:`);
        }
    }

    private async consume(event: DomainEvent, handlers: LocalEventSubscriber[]) {
        await Promise.all(handlers.map((handler) => handler.consume(event)));
    }
}
