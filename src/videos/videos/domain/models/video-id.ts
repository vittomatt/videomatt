import { UUID } from '@shared/domain/uuid-value-object';

export class VideoId extends UUID {
    constructor(public readonly value: string) {
        super(value);
    }
}
