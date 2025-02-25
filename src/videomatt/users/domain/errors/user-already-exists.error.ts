import { DomainError } from '@videomatt/shared/domain/errors/domain.error';

export class UserAlreadyExistsError extends DomainError {
    public readonly type = 'UserAlreadyExistsError';
    public readonly message = 'User already exists';
}
