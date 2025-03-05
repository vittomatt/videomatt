import { EmptyTextError } from '@videomatt/shared/domain/errors/empty-text.error';
import { BaseValueObject } from '@videomatt/shared/domain/value-object';

export class UserFirstName extends BaseValueObject {
    constructor(public readonly value: string) {
        super();
        this.ensureNotEmpty(value);
    }

    private ensureNotEmpty(value: string) {
        if (!value?.length) {
            throw new EmptyTextError('First name');
        }
    }
}
