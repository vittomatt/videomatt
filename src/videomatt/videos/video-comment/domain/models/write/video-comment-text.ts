import { BaseValueObject } from '@videomatt/shared/domain/value-object';

export class VideoCommentText extends BaseValueObject {
    private static readonly MAX_LENGTH = 255;

    constructor(public readonly value: string) {
        super();
        this.ensureNotEmpty(value);
        this.ensureNotTooLong(value);
    }

    private ensureNotEmpty(value: string) {
        if (!value || value.length === 0) {
            throw new Error('Comment text cannot be empty');
        }
    }

    private ensureNotTooLong(value: string) {
        if (value.length > VideoCommentText.MAX_LENGTH) {
            throw new Error(`Comment text cannot be longer than ${VideoCommentText.MAX_LENGTH} characters`);
        }
    }
}
