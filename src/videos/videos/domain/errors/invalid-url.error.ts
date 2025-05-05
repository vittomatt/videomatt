import { DomainError } from '@shared/domain/errors/domain.error';

export class InvalidURLFormatError extends DomainError {
    static readonly type = 'InvalidURLFormatError';

    constructor() {
        super(InvalidURLFormatError.type, 'Invalid URL format');
    }
}
