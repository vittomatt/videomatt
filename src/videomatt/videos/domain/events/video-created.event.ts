import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain-event';
import { UserId } from '@videomatt/users/domain/models/user-id';
import { Video } from '@videomatt/videos/domain/models/video';

export class VideoCreatedEvent extends DomainEvent {
    public readonly videoId: string;
    public readonly userId: string;

    constructor({ video, userId }: { video: Video; userId: UserId }) {
        const eventName = 'video.created';
        super(eventName);
        this.videoId = video.id.value;
        this.userId = userId.value;
    }
}
