import { faker } from '@faker-js/faker';

import { VideoDescription } from '@videomatt/videos/videos/domain/models/write/video-description';

export class VideoDescriptionMother {
    static create(value?: string): VideoDescription {
        return new VideoDescription(value ?? faker.lorem.sentence());
    }
}
