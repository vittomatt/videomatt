import { faker } from '@faker-js/faker';
import { VideoCommentText } from '@videos/video-comment/domain/models/write/video-comment-text';

export class VideoCommentTextMother {
    static create(value?: string): VideoCommentText {
        return new VideoCommentText(value ?? faker.lorem.sentence());
    }
}
