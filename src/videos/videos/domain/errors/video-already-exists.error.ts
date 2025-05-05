import { DomainError } from '@shared/domain/errors/domain.error';

export class VideoAlreadyExistsError extends DomainError {
    static readonly type = 'VideoAlreadyExistsError';

    constructor() {
        super(VideoAlreadyExistsError.type, 'Video already exists');
    }
}
