import { DomainError } from '@shared/domain/errors/domain.error';

export class InvalidUUIDError extends DomainError {
    static readonly type = 'InvalidUUIDError';

    constructor() {
        super(InvalidUUIDError.type, 'Invalid UUID');
    }
}
