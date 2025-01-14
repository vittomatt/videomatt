import { BaseValueObject } from '@shared/domain/ValueObject';

export class VideoDescription extends BaseValueObject {
    constructor(public readonly value: string) {
        super();
    }
}
