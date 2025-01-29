import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain-event';
import { VideoId } from '@videomatt/videos/videos/domain/models/video-id';
import { UserId } from '@videomatt/users/domain/models/user-id';

export class VideoCommentAddedEvent extends DomainEvent {
    public readonly userId: string;
    public readonly videoId: string;

    private constructor(userId: UserId, videoId: VideoId) {
        const eventName = 'videomatt.video.1.event.comment.added';
        super(eventName);
        this.userId = userId.value;
        this.videoId = videoId.value;
    }

    static create(userId: UserId, videoId: VideoId): VideoCommentAddedEvent {
        return new VideoCommentAddedEvent(userId, videoId);
    }
}
