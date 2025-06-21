import { PrimitivesMother } from '@tests/shared/primitives.mother';
import { VideoCommentId } from '@videos/video-comment/domain/models/video-comment-id';

export class VideoCommentIdMother {
    static create(value?: string): VideoCommentId {
        return new VideoCommentId(value ?? PrimitivesMother.randomUUID());
    }
}
