import { EmptyTextError } from '@shared/domain/errors/empty-text.error';
import { BaseValueObject } from '@shared/domain/value-object';

export class VideoTitle extends BaseValueObject {
    constructor(public readonly value: string) {
        super();
        this.ensureNotEmpty(value);
    }

    private ensureNotEmpty(value: string) {
        if (!value?.length) {
            throw new EmptyTextError('Video title');
        }
    }
}
