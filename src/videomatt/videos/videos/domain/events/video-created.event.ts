import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain-event';

export class VideoCreatedEvent extends DomainEvent {
    static readonly eventName = 'videomatt.video.1.event.video.created';

    private constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly description: string,
        public readonly url: string,
        public readonly userId: string
    ) {
        super(VideoCreatedEvent.eventName);
    }

    static create({
        id,
        title,
        description,
        url,
        userId,
    }: {
        id: string;
        title: string;
        description: string;
        url: string;
        userId: string;
    }): VideoCreatedEvent {
        return new VideoCreatedEvent(id, title, description, url, userId);
    }

    isLocal(): boolean {
        return true;
    }

    isRemote(): boolean {
        return true;
    }
}
