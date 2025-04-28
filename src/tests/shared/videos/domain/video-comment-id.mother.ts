import { faker } from '@faker-js/faker';

import { VideoCommentId } from '@videomatt/videos/video-comment/domain/models/write/video-comment-id';

export class VideoCommentIdMother {
    static create(value?: string): VideoCommentId {
        return new VideoCommentId(value ?? faker.string.uuid());
    }
}
