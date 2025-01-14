import { AggregateRoot } from '@shared/domain/AggregateRoot';

import { VideoDescription } from './VideoDescription';
import { VideoId } from './VideoId';
import { VideoTitle } from './VideoTitle';
import { VideoURL } from './VideoURL';

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
