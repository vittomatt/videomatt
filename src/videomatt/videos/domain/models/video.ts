import { AggregateRoot } from '@videomatt/shared/domain/aggregate-root';
import { VideoPublishedEvent } from '@videomatt/videos/domain/events/video-published.event';
import { UserId } from '@videomatt/users/domain/models/user-id';

import { VideoId } from './video-id';
import { VideoTitle } from './video-title';
import { VideoDescription } from './video-description';
import { VideoURL } from './video-url';

export class Video extends AggregateRoot {
    constructor(
        public readonly id: VideoId,
        public readonly title: VideoTitle,
        public readonly description: VideoDescription,
        public readonly url: VideoURL,
        public readonly userId: UserId
    ) {
        super();
    }

    static create(id: string, title: string, description: string, url: string, userId: string) {
        const user = new UserId(userId);
        const video = new Video(
            new VideoId(id),
            new VideoTitle(title),
            new VideoDescription(description),
            new VideoURL(url),
            user
        );

        const event = VideoPublishedEvent.create(user);
        video.record(event);

        return video;
    }

    static fromPrimitives(primitives: { id: string; title: string; description: string; url: string; userId: string }) {
        return new Video(
            new VideoId(primitives.id),
            new VideoTitle(primitives.title),
            new VideoDescription(primitives.description),
            new VideoURL(primitives.url),
            new UserId(primitives.userId)
        );
    }

    toPrimitives() {
        return {
            id: this.id.value,
            title: this.title.value,
            description: this.description.value,
            url: this.url.value,
            userId: this.userId.value,
        };
    }
}
