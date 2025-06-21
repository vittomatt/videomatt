import { EmptyTextError } from '@shared/domain/errors/empty-text.error';
import { ValueObject } from '@shared/domain/value-object';

export class UserFirstName extends ValueObject<string> {
    constructor(value: string) {
        super(value);
        this.ensureNotEmpty(value);
    }

    private ensureNotEmpty(value: string) {
        if (!value?.length) {
            throw new EmptyTextError('First name');
        }
    }
}
