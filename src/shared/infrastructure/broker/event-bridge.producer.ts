import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { RemoteEventProducer } from '@shared/domain/broker/remote-event.producer';
import { DomainEventBus } from '@shared/domain/event-bus/domain-event-bus';
import { DomainEvent } from '@shared/domain/event-bus/domain.event';
import { Logger } from '@shared/domain/logger/logger';
import { SQSSerializer } from '@shared/infrastructure/broker/sqs.serializer';

export abstract class EventBridgeEventProducer implements RemoteEventProducer {
    protected constructor(
        protected readonly eventBus: DomainEventBus,
        protected readonly eventBridgeClient: EventBridgeClient,
        protected readonly logger: Logger
    ) {
        this.eventBus.registerRemoteProducer(this);
    }

    async publish(event: DomainEvent) {
        try {
            if (!this.isValidEvent(event)) {
                return;
            }

            const command = this.createCommand(event);
            await this.eventBridgeClient.send(command);

            this.logger.info(`Event ${event.eventName} sent to EventBridge`);
        } catch (error) {
            this.logger.error(`Error publishing event ${event.eventName}:`);
        }
    }

    private createCommand(event: DomainEvent): PutEventsCommand {
        const payload = SQSSerializer.serialize(event);

        const command = new PutEventsCommand({
            Entries: [
                {
                    Source: 'videomatt',
                    DetailType: event.eventName,
                    EventBusName: 'default',
                    Detail: payload,
                },
            ],
        });

        return command;
    }

    abstract getTopic(): string;

    abstract isValidEvent(event: DomainEvent): boolean;
}
