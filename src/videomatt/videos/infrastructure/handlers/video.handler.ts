import { injectable } from 'tsyringe';

import { Handler } from '@videomatt/shared/domain/broker/handler';
import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain-event';

@injectable()
export class VideoHandler implements Handler {
    constructor() {}

    async handle(event: DomainEvent) {
        return Promise.resolve();
    }
}
