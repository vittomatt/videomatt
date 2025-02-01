import { BaseValueObject } from '@videomatt/shared/domain/value-object';

export class VideoURL extends BaseValueObject {
    constructor(public readonly value: string) {
        super();
        this.ensureValidURL(value);
    }

    private ensureValidURL(value: string) {
        try {
            new URL(value);
        } catch (_) {
            throw new Error('Invalid URL format');
        }
    }
}
