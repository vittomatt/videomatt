import { StringMother } from '@tests/shared/string.mother';
import { VideoCommentText } from '@videos/video-comment/domain/models/video-comment-text';

export class VideoCommentTextMother {
    static create(value?: string): VideoCommentText {
        return new VideoCommentText(value ?? StringMother.random());
    }
}
