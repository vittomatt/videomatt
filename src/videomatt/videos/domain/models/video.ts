import { AggregateRoot } from '@videomatt/shared/domain/aggregate-root';

import { VideoCreatedEvent } from '@videomatt/videos/domain/events/video-created.event';
import { VideoDescription } from './video-description';
import { VideoId } from './video-id';
import { VideoTitle } from './video-title';
import { VideoURL } from './video-url';

export class Video extends AggregateRoot {
    constructor(
        public readonly id: VideoId,
        public readonly title: VideoTitle,
        public readonly description: VideoDescription,
        public readonly url: VideoURL
    ) {
        super();
    }

    static create(id: string, title: string, description: string, url: string) {
        const video = new Video(
            new VideoId(id),
            new VideoTitle(title),
            new VideoDescription(description),
            new VideoURL(url)
        );

        const event = new VideoCreatedEvent(video);
        video.record(event);

        return video;
    }

    static fromPrimitives(primitives: { id: string; title: string; description: string; url: string }) {
        return new Video(
            new VideoId(primitives.id),
            new VideoTitle(primitives.title),
            new VideoDescription(primitives.description),
            new VideoURL(primitives.url)
        );
    }

    toPrimitives() {
        return {
            id: this.id.value,
            title: this.title.value,
            description: this.description.value,
            url: this.url.value,
        };
    }
}
