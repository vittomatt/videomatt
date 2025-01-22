import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

import { Logger } from '@videomatt/shared/domain/logger/logger';
import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain-event';
import { EventPublisher } from '@videomatt/shared/domain/broker/event.publisher';

export class SNSEventPublisher implements EventPublisher {
    constructor(
        protected readonly snsClient: SNSClient,
        protected readonly topicArn: string,
        protected readonly logger: Logger
    ) {}

    async publish(event: DomainEvent) {
        try {
            const command = new PublishCommand({
                TopicArn: this.topicArn,
                Message: JSON.stringify({
                    eventName: event.eventName,
                    occurredOn: event.occurredOn.toISOString(),
                    payload: event,
                }),
                Subject: event.eventName,
            });

            await this.snsClient.send(command);
            this.logger.info(`Event ${event.eventName} sent to SNS`);
        } catch (error) {
            this.logger.error(`Error publishing event ${event.eventName}:`);
        }
    }
}
