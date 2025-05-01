import { RemoteEventConsumer } from '@shared/domain/broker/remote-event.consumer';

export interface Worker {
    start(): Promise<void>;
    registerConsumer(consumer: RemoteEventConsumer): void;
}
