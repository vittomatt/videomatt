import { InvalidUUIDError } from '@shared/domain/errors/invalid-uuid.error';
import { BaseValueObject } from '@shared/domain/value-object';

import { validate } from 'uuid';

export class UserId extends BaseValueObject {
    constructor(public readonly value: string) {
        super();
        this.ensureUUID(value);
    }

    private ensureUUID(value: string) {
        if (!validate(value)) {
            throw new InvalidUUIDError();
        }
    }
}
