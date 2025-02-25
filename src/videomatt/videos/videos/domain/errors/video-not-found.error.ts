import { DomainError } from '@videomatt/shared/domain/errors/domain.error';

export class VideoNotFoundError extends DomainError {
    public readonly type = 'VideoNotFoundError';
    public readonly message = 'Video not found';
}
