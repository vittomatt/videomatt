import { AggregateRoot } from '@videomatt/shared/domain/aggregate-root';

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
