import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain-event';
import { Video } from '@videomatt/videos/domain/models/video';

export class VideoCreatedEvent extends DomainEvent {
    public readonly videoId: string;

    constructor(video: Video) {
        const eventName = 'video.created';
        super(eventName);
        this.videoId = video.id.value;
    }
}
