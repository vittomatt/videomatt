import { faker } from '@faker-js/faker';

import { VideoId } from '@videomatt/videos/videos/domain/models/write/video-id';

export class VideoIdMother {
    static create(value?: string): VideoId {
        return new VideoId(value ?? faker.string.uuid());
    }
}
