import { SNSEventProducer } from '@videomatt/shared/infrastructure/broker/sns-event.producer';
import { VIDEO_TOKEN } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain.event';
import { TOKEN } from '@videomatt/shared/infrastructure/di/tokens';
import { Logger } from '@videomatt/shared/domain/logger/logger';
import { SNSClient } from '@aws-sdk/client-sns';
import { inject, injectable } from 'tsyringe';

@injectable()
export class SNSVideoEventProducer extends SNSEventProducer {
    constructor(
        @inject(TOKEN.SNS_CLIENT) protected readonly sns: SNSClient,
        @inject(TOKEN.LOGGER) protected readonly logger: Logger,
        @inject(VIDEO_TOKEN.SNS_TOPIC_ARN) private readonly topicArn: string
    ) {
        super(sns, logger);
    }

    getTopic(): string {
        return this.topicArn;
    }

    isValidEvent(event: DomainEvent): boolean {
        return event.getEntity() === 'video';
    }
}
