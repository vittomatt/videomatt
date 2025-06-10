import { UUID } from '@shared/domain/uuid-value-object';

export class UserId extends UUID {
    constructor(public readonly value: string) {
        super(value);
    }
}
