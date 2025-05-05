import { DomainError } from '@shared/domain/errors/domain.error';

export class EmptyTextError extends DomainError {
    static readonly type = 'EmptyTextError';

    constructor(fieldName: string) {
        super(EmptyTextError.type, `${fieldName} cannot be empty`);
    }
}
