import { BaseValueObject } from '@videomatt/shared/domain/value-object';

export class VideoDescription extends BaseValueObject {
    constructor(public readonly value: string) {
        super();
    }
}
