import { inject, injectable } from 'tsyringe';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain-event';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';

@injectable()
export class SNSEventPublisher {
    constructor(@inject(TOKEN.SNS_CLIENT) private readonly sns: SNSClient) {
        this.sns = new SNSClient({ region: 'us-east-1' });
    }

    async publish(event: DomainEvent): Promise<void> {
        try {
            const command = new PublishCommand({
                TopicArn: 'arn:aws:sns:us-east-1:257201716142:codelyty_video_1_event_video_published',
                Message: JSON.stringify({
                    eventName: event.eventName,
                    occurredOn: event.occurredOn.toISOString(),
                    payload: event,
                }),
                Subject: event.eventName,
            });

            await this.sns.send(command);
            console.log(`Event ${event.eventName} sent to SNS`);
        } catch (error) {
            console.error(`Error publishing event ${event.eventName}:`, error);
        }
    }
}
