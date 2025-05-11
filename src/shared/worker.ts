import { RemoteEventConsumer } from '@shared/domain/broker/remote-event.consumer';

export abstract class Worker {
    protected isRunning = false;

    abstract start(): Promise<void>;
    abstract registerConsumer(consumer: RemoteEventConsumer): void;

    public stop() {
        this.isRunning = false;
    }

    protected sleep(ms: number) {
        return new Promise((res) => setTimeout(res, ms));
    }
}
