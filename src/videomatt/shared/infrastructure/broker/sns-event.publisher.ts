import { EventPublisher } from '@videomatt/shared/domain/broker/event.publisher';
import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain-event';
import { Logger } from '@videomatt/shared/domain/logger/logger';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

export abstract class SNSEventPublisher implements EventPublisher {
    protected constructor(
        protected readonly snsClient: SNSClient,
        protected readonly logger: Logger
    ) {}

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
