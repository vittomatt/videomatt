import { DomainError } from '@shared/domain/errors/domain.error';

export class VideoAlreadyExistsError extends DomainError {
    public readonly type = 'VideoAlreadyExistsError';
    public readonly message = 'Video already exists';
}
