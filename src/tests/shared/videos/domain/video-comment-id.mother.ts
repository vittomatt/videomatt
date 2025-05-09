import { faker } from '@faker-js/faker';
import { VideoCommentId } from '@videos/video-comment/domain/models/video-comment-id';

export class VideoCommentIdMother {
    static create(value?: string): VideoCommentId {
        return new VideoCommentId(value ?? faker.string.uuid());
    }
}
