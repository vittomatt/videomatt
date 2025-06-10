import { BaseValueObject } from '@shared/domain/value-object';
import { NegativeAmountOfVideosError } from '@users/domain/errors/negative-amount-of-videos.error';

export class UserAmountOfVideo extends BaseValueObject {
    constructor(public readonly value: number) {
        super();
        this.ensureNotNegative(value);
    }

    private ensureNotNegative(value: number) {
        if (value < 0) {
            throw new NegativeAmountOfVideosError();
        }
    }
}
