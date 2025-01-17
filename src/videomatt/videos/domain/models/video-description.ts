import { BaseValueObject } from '@videomatt/shared/domain/value-object';

export class VideoDescription extends BaseValueObject {
    constructor(public readonly value: string) {
        super();
        this.ensureNotEmpty(value);
    }

    private ensureNotEmpty(value: string) {
        if (!value || value.length === 0) {
            throw new Error('Video description cannot be empty');
        }
    }
}
