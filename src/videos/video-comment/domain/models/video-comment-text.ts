import { ValueObject } from '@shared/domain/value-object';
import { CommentIsEmptyError } from '@videos/videos/domain/errors/comment-is-empty.error';
import { CommentIsTooLongError } from '@videos/videos/domain/errors/comment-is-too-long.error';

export class VideoCommentText extends ValueObject<string> {
    private static readonly MAX_LENGTH = 255;

    constructor(value: string) {
        super(value);
        this.ensureNotEmpty(value);
        this.ensureNotTooLong(value);
    }

    private ensureNotEmpty(value: string) {
        if (!value?.length) {
            throw new CommentIsEmptyError();
        }
    }

    private ensureNotTooLong(value: string) {
        if (value.length > VideoCommentText.MAX_LENGTH) {
            throw new CommentIsTooLongError(
                `Comment text cannot be longer than ${VideoCommentText.MAX_LENGTH} characters`
            );
        }
    }
}
