import { UserIdMother } from '../users/user-id-mother';
import { VideoCommentIdMother } from './video-comment-id-mother';
import { VideoCommentTextMother } from './video-comment-text-mother';
import { VideoIdMother } from './video-id-mother';

import {
    VideoComment,
    VideoCommentPrimitives,
} from '@videomatt/videos/video-comment/domain/models/write/video-comment';

export class VideoCommentMother {
    static create(params?: Partial<VideoCommentPrimitives>): VideoComment {
        const primitives: VideoCommentPrimitives = {
            id: params?.id ?? VideoCommentIdMother.create().value,
            text: params?.text ?? VideoCommentTextMother.create().value,
            userId: params?.userId ?? UserIdMother.create().value,
            videoId: params?.videoId ?? VideoIdMother.create().value,
            ...params,
        };

        return VideoComment.fromPrimitives(primitives);
    }
}
