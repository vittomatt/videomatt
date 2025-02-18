import { VideoCommentAddedEvent } from '@videomatt/videos/video-comment/domain/events/video-comment-added.event';
import { VideoComment } from '@videomatt/videos/video-comment/domain/models/write/video-comment';
import { VideoCreatedEvent } from '@videomatt/videos/videos/domain/events/video-created.event';
import { AggregateRoot } from '@videomatt/shared/domain/aggregate-root';
import { UserId } from '@videomatt/users/domain/models/write/user-id';
import { VideoDescription } from './video-description';
import { VideoTitle } from './video-title';
import { VideoURL } from './video-url';
import { VideoId } from './video-id';

export class Video extends AggregateRoot {
    constructor(
        public readonly id: VideoId,
        public readonly title: VideoTitle,
        public readonly description: VideoDescription,
        public readonly url: VideoURL,
        public readonly comments: VideoComment[],
        private readonly userId: UserId
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
    }) {
        const user = new UserId(userId);
        const videoComments = comments ?? [];

        const video = new Video(
            new VideoId(id),
            new VideoTitle(title),
            new VideoDescription(description),
            new VideoURL(url),
            videoComments,
            user
        );

        const event = VideoCreatedEvent.create({ id, title, description, url, userId, videoId: id });
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
    }: {
        id: string;
        title: string;
        description: string;
        url: string;
        userId: string;
        comments?: {
            id: string;
            text: string;
            userId: string;
            videoId: string;
        }[];
    }) {
        return new Video(
            new VideoId(id),
            new VideoTitle(title),
            new VideoDescription(description),
            new VideoURL(url),
            comments.map((comment) => VideoComment.fromPrimitives(comment)),
            new UserId(userId)
        );
    }

    toPrimitives() {
        return {
            id: this.id.value,
            title: this.title.value,
            description: this.description.value,
            url: this.url.value,
            userId: this.userId.value,
            comments: this.comments.map((comment) => comment.toPrimitives()),
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
