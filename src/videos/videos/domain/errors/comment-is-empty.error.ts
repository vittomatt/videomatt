import { DomainError } from '@shared/domain/errors/domain.error';

export class CommentIsEmptyError extends DomainError {
    static readonly type = 'CommentIsEmptyError';

    constructor() {
        super(CommentIsEmptyError.type, 'Comment text cannot be empty');
    }
}
