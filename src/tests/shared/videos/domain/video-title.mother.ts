import { faker } from '@faker-js/faker';
import { VideoTitle } from '@videos/videos/domain/models/write/video-title';

export class VideoTitleMother {
    static create(value?: string): VideoTitle {
        return new VideoTitle(value ?? faker.lorem.sentence());
    }
}
