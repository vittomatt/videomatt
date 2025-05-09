import { DomainError } from '@shared/domain/errors/domain.error';

export class InvalidNumberError extends DomainError {
    static readonly type = 'InvalidNumberError';

    constructor(fieldName: string) {
        super(InvalidNumberError.type, `${fieldName} is not a valid number`);
    }
}
