import { DomainError } from '@shared/domain/errors/domain.error';

export class InvalidUUIDError extends DomainError {
    public readonly type = 'InvalidUUIDError';
    public readonly message = 'Invalid UUID';
}
