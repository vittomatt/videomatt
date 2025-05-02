import { RemoteEventConsumer } from '@shared/domain/broker/remote-event.consumer';

export abstract class Worker {
    abstract start(): Promise<void>;
    abstract registerConsumer(consumer: RemoteEventConsumer): void;

    protected sleep(ms: number) {
        return new Promise((res) => setTimeout(res, ms));
    }
}
