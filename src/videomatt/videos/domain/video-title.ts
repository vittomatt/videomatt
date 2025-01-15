import { BaseValueObject } from '@shared/domain/value-object';

export class VideoTitle extends BaseValueObject {
    constructor(public readonly value: string) {
        super();
    }
}
