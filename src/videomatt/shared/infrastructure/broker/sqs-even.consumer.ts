import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';

import { EventConsumer } from '@videomatt/shared/domain/broker/event.consumer';
import { Handler } from '@videomatt/shared/domain/broker/handler';
import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain-event';
import { Logger } from '@videomatt/shared/domain/logger/logger';

export class SQSEventConsumer implements EventConsumer {
    constructor(
        protected readonly sqsClient: SQSClient,
        protected readonly sqsUrl: string,
        protected readonly logger: Logger,
        protected readonly handler: Handler
    ) {}

    async consume(queueUrl: string) {
        try {
            const params = new ReceiveMessageCommand({
                QueueUrl: queueUrl,
                MaxNumberOfMessages: 1,
                WaitTimeSeconds: 10,
                VisibilityTimeout: 30,
            });

            const response = await this.sqsClient.send(params);

            if (!response.Messages || response.Messages.length === 0) {
                this.logger.info('There are no messages in the queue');
                return;
            }

            for (const message of response.Messages) {
                this.logger.info(`Queue URL: ${queueUrl}`);
                this.logger.info(`Message received: ${message.Body}`);

                // fitu here
                await this.handler.handle(message.Body as unknown as DomainEvent);

                if (message.ReceiptHandle) {
                    await this.deleteMessage(queueUrl, message.ReceiptHandle);
                }
            }
        } catch (error) {
            this.logger.error('Error reading messages from SQS');
            throw error;
        }
    }

    private async deleteMessage(queueUrl: string, receiptHandle: string) {
        try {
            const params = new DeleteMessageCommand({
                QueueUrl: queueUrl,
                ReceiptHandle: receiptHandle,
            });

            await this.sqsClient.send(params);

            this.logger.info(`Message deleted: ${receiptHandle}`);
        } catch (error) {
            this.logger.error('Error deleting message from SQS');
        }
    }
}
