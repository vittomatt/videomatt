export interface EventConsumer {
    consume(queueUrl: string): Promise<void>;
}
