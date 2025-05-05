import { DomainError } from '@shared/domain/errors/domain.error';

export class UserNotFoundError extends DomainError {
    static readonly type = 'UserNotFoundError';

    constructor() {
        super(UserNotFoundError.type, 'User not found');
    }
}
