import { Message } from '@aws-sdk/client-sqs';
import { DomainEvent } from '@shared/domain/event-bus/domain.event';

export class SQSSerializer {
    static serialize(event: DomainEvent): string {
        return JSON.stringify({ ...event, occurredOn: event.occurredOn.toISOString() });
    }

    static deserialize(message: Message): DomainEvent | null {
        const parsedBody = JSON.parse(message.Body as string);

        if (!parsedBody.detail && !parsedBody.Message) {
            return null;
        }

        // EventBridge
        if (parsedBody.detail) {
            return parsedBody.detail;
        }

        // SQS
        return JSON.parse(parsedBody.Message as string);
    }
}
