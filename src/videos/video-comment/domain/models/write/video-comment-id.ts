import { BaseValueObject } from '@shared/domain/value-object';

export class VideoCommentId extends BaseValueObject {
    constructor(public readonly value: string) {
        super();
        this.ensureUUID(value);
    }

    private ensureUUID(value: string) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(value)) {
            throw new Error('Invalid UUID format');
        }
    }
}
