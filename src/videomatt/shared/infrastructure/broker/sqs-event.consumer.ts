import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';

import { EventConsumer } from '@videomatt/shared/domain/broker/event.consumer';
import { Handler } from '@videomatt/shared/domain/broker/handler';
import { Logger } from '@videomatt/shared/domain/logger/logger';

export class SQSEventConsumer implements EventConsumer {
    protected constructor(
        protected readonly sqsClient: SQSClient,
        protected readonly sqsUrl: string,
        protected readonly logger: Logger,
        protected readonly handler: Handler
    ) {}

    async consume() {
        try {
            const params = new ReceiveMessageCommand({
                QueueUrl: this.sqsUrl,
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
                this.logger.info(`Queue URL: ${this.sqsUrl}`);
                this.logger.info(`Message received: ${message.Body}`);

                const parsedBody = JSON.parse(message.Body as string);
                const parsedMessage = JSON.parse(parsedBody.Message as string);
                await this.handler.handle(parsedMessage.payload);

                if (message.ReceiptHandle) {
                    await this.deleteMessage(this.sqsUrl, message.ReceiptHandle);
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
