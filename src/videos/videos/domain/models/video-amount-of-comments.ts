import { InvalidNumberError } from '@shared/domain/errors/invalid-number.error';
import { BaseValueObject } from '@shared/domain/value-object';

export class VideoAmountOfComments extends BaseValueObject {
    constructor(public readonly value: number) {
        super();
        this.ensureGreaterThanZero(value);
    }

    private ensureGreaterThanZero(value: number) {
        if (value < 0) {
            throw new InvalidNumberError('VideoAmountOfComments');
        }
    }
}
