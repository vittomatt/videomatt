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
}
