import { AggregateRoot } from '@shared/domain/aggregate-root';
import { VideoCreatedEvent } from '@shared/domain/events/video-created.event';
import { ExtractOptionalPrimitives, ExtractPrimitives } from '@shared/domain/models/extract-primitives';
import { UserId } from '@shared/domain/models/user-id';
import { VideoCommentAddedEvent } from '@videos/video-comment/domain/events/video-comment-added.event';
import { VideoComment, VideoCommentPrimitives } from '@videos/video-comment/domain/models/video-comment';
import { VideoDescription } from '@videos/videos/domain/models/video-description';
import { VideoId } from '@videos/videos/domain/models/video-id';
import { VideoTitle } from '@videos/videos/domain/models/video-title';
import { VideoURL } from '@videos/videos/domain/models/video-url';

export type VideoPrimitives = ExtractOptionalPrimitives<Video> & {
    comments: VideoCommentPrimitives[];
};

export class Video extends AggregateRoot<Video> {
    constructor(
        public readonly id: VideoId,
        public readonly title: VideoTitle,
        public readonly description: VideoDescription,
        public readonly url: VideoURL,
        public readonly userId: UserId,
        public readonly comments: VideoComment[]
    ) {
        super();
    }

    static create({
        id,
        title,
        description,
        url,
        userId,
        comments,
    }: {
        id: string;
        title: string;
        description: string;
        url: string;
        userId: string;
        comments?: VideoComment[];
    }): Video {
        const user = new UserId(userId);
        const videoComments = comments ?? [];

        const video = new Video(
            new VideoId(id),
            new VideoTitle(title),
            new VideoDescription(description),
            new VideoURL(url),
            user,
            videoComments
        );

        const event = VideoCreatedEvent.create({ id, userId, title, description, url, videoId: id });
        video.record(event);

        return video;
    }

    static fromPrimitives({
        id,
        title,
        description,
        url,
        userId,
        comments = [],
    }: ExtractPrimitives<Video> & {
        comments?: VideoCommentPrimitives[];
    }): Video {
        return new Video(
            new VideoId(id),
            new VideoTitle(title),
            new VideoDescription(description),
            new VideoURL(url),
            new UserId(userId),
            comments.map((comment) => VideoComment.fromPrimitives(comment as ExtractPrimitives<VideoComment>))
        );
    }

    toPrimitives(): ExtractPrimitives<Video> & {
        comments: VideoCommentPrimitives[];
    } {
        return {
            id: this.id.value,
            title: this.title.value,
            description: this.description.value,
            url: this.url.value,
            userId: this.userId.value,
            comments: this.comments.map((comment: VideoComment) => comment.toPrimitives()),
        };
    }

    addComment(comment: VideoComment) {
        this.comments.push(comment);
        this.record(
            VideoCommentAddedEvent.create({
                id: comment.id.value,
                text: comment.text.value,
                userId: this.userId.value,
                videoId: this.id.value,
                commentId: comment.id.value,
            })
        );
    }
}
