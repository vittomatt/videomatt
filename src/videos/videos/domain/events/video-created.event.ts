import { DomainEvent } from '@shared/domain/event-bus/domain.event';

export class VideoCreatedEvent extends DomainEvent {
    static readonly eventName = 'videomatt.video.1.event.video.created';
    public readonly eventName = VideoCreatedEvent.eventName;

    private constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly description: string,
        public readonly url: string,
        public readonly userId: string,
        public readonly videoId: string
    ) {
        super();
    }

    static create({
        id,
        title,
        description,
        url,
        userId,
        videoId,
    }: {
        id: string;
        title: string;
        description: string;
        url: string;
        userId: string;
        videoId: string;
    }): VideoCreatedEvent {
        return new VideoCreatedEvent(id, title, description, url, userId, videoId);
    }

    isLocal(): boolean {
        return true;
    }

    isRemote(): boolean {
        return true;
    }
}
