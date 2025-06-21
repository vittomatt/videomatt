import { DomainError } from '@shared/domain/errors/domain.error';

export class InvalidArgumentError extends DomainError {
    static readonly type = 'InvalidArgumentError';

    constructor(fieldName: string) {
        super(InvalidArgumentError.type, `${fieldName} is not a valid argument`);
    }
}
