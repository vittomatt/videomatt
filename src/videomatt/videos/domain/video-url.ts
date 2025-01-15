import { BaseValueObject } from '@shared/domain/value-object';

export class VideoURL extends BaseValueObject {
    constructor(public readonly value: number) {
        super();
    }
}
