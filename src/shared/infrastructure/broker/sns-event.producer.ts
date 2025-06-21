import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { RemoteEventProducer } from '@shared/domain/broker/remote-event.producer';
import { DomainEventBus } from '@shared/domain/event-bus/domain-event-bus';
import { DomainEvent } from '@shared/domain/event-bus/domain.event';
import { Logger } from '@shared/domain/logger/logger';
import { SQSSerializer } from '@shared/infrastructure/broker/sqs.serializer';
import { FailoverDomainEvents } from '@shared/infrastructure/events/failover-domain-events';

export abstract class SNSEventProducer implements RemoteEventProducer {
    protected constructor(
        protected readonly eventBus: DomainEventBus,
        protected readonly snsClient: SNSClient,
        protected readonly logger: Logger,
        protected readonly failover: FailoverDomainEvents
    ) {
        this.eventBus.registerRemoteProducer(this);
    }

    async publish(event: DomainEvent) {
        const eventName = (event.constructor as typeof DomainEvent).eventName;

        try {
            if (!this.isValidEvent(event)) {
                return;
            }

            const command = this.createCommand(event);
            await this.snsClient.send(command);

            this.logger.info(`Event ${eventName} sent to SNS`);
        } catch (error) {
            this.logger.error(`Error publishing event ${eventName}: ${error}`);
            await this.failover.publish(event);
        }
    }

    async publishFromFailover() {
        const events = await this.failover.consume();
        for (const event of events) {
            await this.publish(event);
        }
    }

    private createCommand(event: DomainEvent): PublishCommand {
        const eventName = (event.constructor as typeof DomainEvent).eventName;
        const payload = SQSSerializer.serialize(event);

        const command = new PublishCommand({
            TopicArn: this.getTopic(),
            Message: payload,
            Subject: eventName,
            MessageAttributes: {
                EventType: {
                    DataType: 'String',
                    StringValue: eventName,
                },
            },
        });

        return command;
    }

    abstract getTopic(): string;

    abstract isValidEvent(event: DomainEvent): boolean;
}
