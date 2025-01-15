import { BaseValueObject } from '@videomatt/shared/domain/value-object';

export class VideoURL extends BaseValueObject {
    constructor(public readonly value: string) {
        super();
    }
}
