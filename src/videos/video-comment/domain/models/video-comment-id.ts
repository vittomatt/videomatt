import { UUID } from '@shared/domain/uuid-value-object';

export class VideoCommentId extends UUID {
    constructor(public readonly value: string) {
        super(value);
    }
}
