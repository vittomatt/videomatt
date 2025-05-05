import { DomainError } from '@shared/domain/errors/domain.error';

export class VideoNotFoundError extends DomainError {
    static readonly type = 'VideoNotFoundError';

    constructor() {
        super(VideoNotFoundError.type, 'Video not found');
    }
}
