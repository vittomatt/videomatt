import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain-event';
import { UserId } from '@videomatt/users/domain/models/write/user-id';

export class VideoPublishedEvent extends DomainEvent {
    public readonly userId: string;

    private constructor(userId: UserId) {
        const eventName = 'videomatt.video.1.event.video.published';
        super(eventName);
        this.userId = userId.value;
    }

    static create(userId: UserId): VideoPublishedEvent {
        return new VideoPublishedEvent(userId);
    }
}
