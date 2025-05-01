import { DeleteMessageCommand, Message, ReceiveMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { DomainHandler } from '@shared/domain/broker/domain-handler';
import { RemoteEventConsumer } from '@shared/domain/broker/remote-event.consumer';
import { Logger } from '@shared/domain/logger/logger';

const RETRY_QUEUE_SUFFIX = '_retry';

export class SQSEventConsumer implements RemoteEventConsumer {
    protected constructor(
        protected readonly sqsClient: SQSClient,
        protected readonly sqsUrl: string,
        protected readonly logger: Logger,
        protected readonly handler?: DomainHandler<void>
    ) {}

    async consume() {
        const queues: string[] = [this.sqsUrl, `${this.sqsUrl}${RETRY_QUEUE_SUFFIX}`];
        const promises = queues.map((queue) => this.handleQueue(queue));
        await Promise.all(promises);
    }

    private async handleQueue(queueUrl: string) {
        try {
            const params = new ReceiveMessageCommand({
                QueueUrl: queueUrl,
                MaxNumberOfMessages: 1,
                WaitTimeSeconds: 10,
                VisibilityTimeout: 30,
            });

            const response = await this.sqsClient.send(params);

            if (!response.Messages?.length) {
                return;
            }

            for (const message of response.Messages) {
                await this.handleMessage(message);
            }
        } catch (error) {
            this.logger.error(`Error reading messages from SQS: ${error}`);
        }
    }

    private async handleMessage(message: Message) {
        this.logger.info(`Queue URL: ${this.sqsUrl}`);
        this.logger.info(`Message received: ${message.Body}`);

        const parsedBody = JSON.parse(message.Body as string);
        const parsedMessage = JSON.parse(parsedBody.Message as string);
        await this.handler?.handle(parsedMessage.payload);

        if (message.ReceiptHandle) {
            await this.deleteMessage(this.sqsUrl, message.ReceiptHandle);
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
