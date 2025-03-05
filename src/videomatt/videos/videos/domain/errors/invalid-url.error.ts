import { DomainError } from '@videomatt/shared/domain/errors/domain.error';

export class InvalidURLFormatError extends DomainError {
    public readonly type = 'InvalidURLFormatError';
    public readonly message = 'Invalid URL format';
}
