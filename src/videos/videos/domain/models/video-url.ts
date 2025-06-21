import { ValueObject } from '@shared/domain/value-object';
import { InvalidURLFormatError } from '@videos/videos/domain/errors/invalid-url.error';

export class VideoURL extends ValueObject<string> {
    constructor(value: string) {
        super(value);
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
