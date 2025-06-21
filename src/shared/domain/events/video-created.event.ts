import { DomainEvent } from '@shared/domain/event-bus/domain.event';

export class VideoCreatedEvent extends DomainEvent {
    static readonly eventName = 'videomatt.videos.1.event.video.created';

    private constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly title: string,
        public readonly description: string,
        public readonly url: string,
        public readonly videoId: string
    ) {
        super(id, userId);
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
        return new VideoCreatedEvent(id, userId, title, description, url, videoId);
    }

    isLocal(): boolean {
        return true;
    }

    isRemote(): boolean {
        return true;
    }
}
