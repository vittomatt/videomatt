import { DomainError } from '@shared/domain/errors/domain.error';

export class CommentIsTooLongError extends DomainError {
    static readonly type = 'CommentIsTooLongError';

    constructor(message?: string) {
        super(CommentIsTooLongError.type, message ?? 'Comment text cannot be longer than 255 characters');
    }
}
