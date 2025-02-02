import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain-event';

export class VideoPublishedEvent extends DomainEvent {
    private constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly description: string,
        public readonly url: string,
        public readonly userId: string
    ) {
        const eventName = 'videomatt.video.1.event.video.published';
        super(eventName);
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
    }): VideoPublishedEvent {
        return new VideoPublishedEvent(id, title, description, url, userId);
    }
}
