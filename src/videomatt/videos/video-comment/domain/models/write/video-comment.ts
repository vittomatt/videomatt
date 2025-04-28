import { VideoCommentId } from './video-comment-id';
import { VideoCommentText } from './video-comment-text';

import { UserId } from '@videomatt/users/domain/models/write/user-id';
import { VideoId } from '@videomatt/videos/videos/domain/models/write/video-id';

export class VideoComment {
    constructor(
        public readonly id: VideoCommentId,
        public readonly text: VideoCommentText,
        public readonly userId: UserId,
        public readonly videoId: VideoId
    ) {}

    static create({ id, text, userId, videoId }: { id: string; text: string; userId: string; videoId: string }) {
        const comment = new VideoComment(
            new VideoCommentId(id),
            new VideoCommentText(text),
            new UserId(userId),
            new VideoId(videoId)
        );

        return comment;
    }

    static fromPrimitives({ id, text, userId, videoId }: VideoCommentPrimitives) {
        return new VideoComment(
            new VideoCommentId(id),
            new VideoCommentText(text),
            new UserId(userId),
            new VideoId(videoId)
        );
    }

    toPrimitives(): VideoCommentPrimitives {
        return {
            id: this.id.value,
            text: this.text.value,
            userId: this.userId.value,
            videoId: this.videoId.value,
        };
    }
}

export type VideoCommentPrimitives = {
    id: string;
    text: string;
    userId: string;
    videoId: string;
};
