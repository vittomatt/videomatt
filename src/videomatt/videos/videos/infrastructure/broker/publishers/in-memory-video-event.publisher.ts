import { inject, singleton } from 'tsyringe';

import { InMemoryEventCommentAddedSubscriber } from '@videomatt/videos/videos/infrastructure/broker/subscriber/in-memory-event-comment-added.subscriber';
import { InMemoryEventVideoCreatedSubscriber } from '@videomatt/videos/videos/infrastructure/broker/subscriber/in-memory-event-video-created.subscriber';
import { VideoCommentAddedEvent } from '@videomatt/videos/video-comment/domain/events/video-comment-added.event';
import { VideoCreatedEvent } from '@videomatt/videos/videos/domain/events/video-created.event';
import { LocalEventSubscriber } from '@videomatt/shared/domain/broker/local-event.subscriber';
import { LocalEventPublisher } from '@videomatt/shared/domain/broker/local-event.publisher';
import { VIDEO_TOKEN } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { DomainEventBus } from '@videomatt/shared/domain/event-bus/domain-event-bus';
import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain.event';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { Logger } from '@videomatt/shared/domain/logger/logger';

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
