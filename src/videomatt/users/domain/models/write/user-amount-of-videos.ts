import { NegativeAmountOfVideosError } from '@videomatt/users/domain/errors/negative-amount-of-videos.error';
import { BaseValueObject } from '@videomatt/shared/domain/value-object';

export class UserAmountOfVideo extends BaseValueObject {
    constructor(public readonly value: number) {
        super();
        this.ensureNotEmpty(value);
    }

    private ensureNotEmpty(value: number) {
        if (value < 0) {
            throw new NegativeAmountOfVideosError();
        }
    }
}
