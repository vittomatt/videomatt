import { InvalidNumberError } from '@shared/domain/errors/invalid-number.error';
import { ValueObject } from '@shared/domain/value-object';

export class VideoAmountOfComments extends ValueObject<number> {
    constructor(value: number) {
        super(value);
        this.ensureGreaterThanZero(value);
    }

    private ensureGreaterThanZero(value: number) {
        if (value < 0) {
            throw new InvalidNumberError('VideoAmountOfComments');
        }
    }
}
