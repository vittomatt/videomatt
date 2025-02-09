export interface RemoteEventConsumer {
    consume(queueUrl: string): Promise<void>;
}
