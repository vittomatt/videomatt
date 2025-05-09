import { VideoCommentId } from './video-comment-id';
import { VideoCommentText } from './video-comment-text';

import { ExtractOptionalPrimitives, ExtractPrimitives } from '@shared/domain/models/extract-primitives';
import { UserId } from '@shared/domain/models/write/user-id';
import { VideoId } from '@videos/videos/domain/models/write/video-id';

export type VideoCommentPrimitives = ExtractOptionalPrimitives<VideoComment>;

export class VideoComment {
    constructor(
        public readonly id: VideoCommentId,
        public readonly text: VideoCommentText,
        public readonly userId: UserId,
        public readonly videoId: VideoId
    ) {}

    static create({
        id,
        text,
        userId,
        videoId,
    }: {
        id: string;
        text: string;
        userId: string;
        videoId: string;
    }): VideoComment {
        const comment = new VideoComment(
            new VideoCommentId(id),
            new VideoCommentText(text),
            new UserId(userId),
            new VideoId(videoId)
        );

        return comment;
    }

    static fromPrimitives({ id, text, userId, videoId }: ExtractPrimitives<VideoComment>): VideoComment {
        return new VideoComment(
            new VideoCommentId(id),
            new VideoCommentText(text),
            new UserId(userId),
            new VideoId(videoId)
        );
    }

    toPrimitives(): ExtractPrimitives<VideoComment> {
        return {
            id: this.id.value,
            text: this.text.value,
            userId: this.userId.value,
            videoId: this.videoId.value,
        };
    }
}
