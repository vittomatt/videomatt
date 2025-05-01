import { BaseValueObject } from '@shared/domain/value-object';
import { InvalidURLFormatError } from '@videos/videos/domain/errors/invalid-url.error';

export class VideoURL extends BaseValueObject {
    constructor(public readonly value: string) {
        super();
        this.ensureValidURL(value);
    }

    private ensureValidURL(value: string) {
        try {
            new URL(value);
        } catch (_) {
            throw new InvalidURLFormatError();
        }
    }
}
