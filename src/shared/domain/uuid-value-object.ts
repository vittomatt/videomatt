import { InvalidUUIDError } from '@shared/domain/errors/invalid-uuid.error';
import { ValueObject } from '@shared/domain/value-object';

import { validate } from 'uuid';

export class UUID extends ValueObject<string> {
    constructor(value: string) {
        super(value);
        this.ensureUUID(value);
    }

    private ensureUUID(value: string) {
        if (!validate(value)) {
            throw new InvalidUUIDError();
        }
    }
}
