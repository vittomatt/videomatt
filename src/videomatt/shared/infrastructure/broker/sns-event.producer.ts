import { RemoteEventProducer } from '@videomatt/shared/domain/broker/remote-event.producer';
import { DomainEventBus } from '@videomatt/shared/domain/event-bus/domain-event-bus';
import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain.event';
import { Logger } from '@videomatt/shared/domain/logger/logger';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

export abstract class SNSEventProducer implements RemoteEventProducer {
    protected constructor(
        protected readonly eventBus: DomainEventBus,
        protected readonly snsClient: SNSClient,
        protected readonly logger: Logger
    ) {
        this.eventBus.registerRemoteProducer(this);
    }

    async publish(event: DomainEvent) {
        try {
            if (!this.isValidEvent(event)) {
                return;
            }

            const command = new PublishCommand({
                TopicArn: this.getTopic(),
                Message: JSON.stringify({
                    payload: { ...event, occurredOn: event.occurredOn.toISOString() },
                }),
                Subject: event.eventName,
                MessageAttributes: {
                    EventType: {
                        DataType: 'String',
                        StringValue: event.eventName,
                    },
                },
            });

            await this.snsClient.send(command);
            this.logger.info(`Event ${event.eventName} sent to SNS`);
        } catch (error) {
            this.logger.error(`Error publishing event ${event.eventName}:`);
        }
    }

    abstract getTopic(): string;

    abstract isValidEvent(event: DomainEvent): boolean;
}
