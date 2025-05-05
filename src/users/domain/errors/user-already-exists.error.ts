import { DomainError } from '@shared/domain/errors/domain.error';

export class UserAlreadyExistsError extends DomainError {
    static readonly type = 'UserAlreadyExistsError';

    constructor() {
        super(UserAlreadyExistsError.type, 'User already exists');
    }
}
