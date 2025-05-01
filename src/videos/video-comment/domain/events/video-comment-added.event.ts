import { DomainEvent } from '@shared/domain/event-bus/domain.event';

export class VideoCommentAddedEvent extends DomainEvent {
    static readonly eventName = 'videomatt.video.1.event.comment.added';
    public readonly eventName = VideoCommentAddedEvent.eventName;

    private constructor(
        public readonly id: string,
        public readonly text: string,
        public readonly userId: string,
        public readonly videoId: string,
        public readonly commentId: string
    ) {
        super();
    }

    static create({
        id,
        text,
        userId,
        videoId,
        commentId,
    }: {
        id: string;
        text: string;
        userId: string;
        videoId: string;
        commentId: string;
    }): VideoCommentAddedEvent {
        return new VideoCommentAddedEvent(id, text, userId, videoId, commentId);
    }

    isLocal(): boolean {
        return true;
    }

    isRemote(): boolean {
        return false;
    }
}
