import { BaseValueObject } from '@shared/domain/ValueObject';

export class VideoTitle extends BaseValueObject {
    constructor(public readonly value: string) {
        super();
    }
}
