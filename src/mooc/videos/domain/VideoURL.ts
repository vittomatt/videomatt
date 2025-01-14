import { BaseValueObject } from '@shared/domain/ValueObject';

export class VideoURL extends BaseValueObject {
    constructor(public readonly value: number) {
        super();
    }
}
