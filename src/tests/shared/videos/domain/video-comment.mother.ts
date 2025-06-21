import { ExtractPrimitives } from '@shared/domain/models/extract-primitives';
import { UserIdMother } from '@tests/shared/users/domain/user-id.mother';
import { VideoCommentIdMother } from '@tests/shared/videos/domain/video-comment-id.mother';
import { VideoCommentTextMother } from '@tests/shared/videos/domain/video-comment-text.mother';
import { VideoIdMother } from '@tests/shared/videos/domain/video-id.mother';
import { VideoComment, VideoCommentPrimitives } from '@videos/video-comment/domain/models/video-comment';

export class VideoCommentMother {
    static create(params?: Partial<VideoCommentPrimitives>): VideoComment {
        const primitives: VideoCommentPrimitives = {
            id: params?.id ?? VideoCommentIdMother.create().value,
            text: params?.text ?? VideoCommentTextMother.create().value,
            userId: params?.userId ?? UserIdMother.create().value,
            videoId: params?.videoId ?? VideoIdMother.create().value,
            ...params,
        };

        return VideoComment.fromPrimitives(primitives as ExtractPrimitives<VideoComment>);
    }
}
