import { BaseValueObject } from '@shared/domain/ValueObject';

export class VideoId extends BaseValueObject {
    constructor(public readonly value: string) {
        super();
    }
}
