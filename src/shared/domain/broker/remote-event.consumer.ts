export interface RemoteEventConsumer {
    consume(): Promise<void>;
}
