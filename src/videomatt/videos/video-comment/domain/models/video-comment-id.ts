import { BaseValueObject } from '@videomatt/shared/domain/value-object';

export class VideoCommentId extends BaseValueObject {
    constructor(public readonly value: string) {
        super();
        this.ensureUUID(value);
    }

    private ensureUUID(value: string) {}
}
