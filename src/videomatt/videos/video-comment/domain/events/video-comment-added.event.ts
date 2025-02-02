import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain-event';

export class VideoCommentAddedEvent extends DomainEvent {
    private constructor(
        public readonly id: string,
        public readonly text: string,
        public readonly userId: string,
        public readonly videoId: string
    ) {
        const eventName = 'videomatt.video.1.event.comment.added';
        super(eventName);
    }

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
    }): VideoCommentAddedEvent {
        return new VideoCommentAddedEvent(id, text, userId, videoId);
    }
}
