import { BaseValueObject } from '@videomatt/shared/domain/value-object';

export class VideoTitle extends BaseValueObject {
    constructor(public readonly value: string) {
        super();
        this.ensureNotEmpty(value);
    }

    private ensureNotEmpty(value: string) {
        if (!value?.length) {
            throw new Error('Video title cannot be empty');
        }
    }
}
