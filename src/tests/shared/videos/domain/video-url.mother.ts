import { faker } from '@faker-js/faker';
import { VideoURL } from '@videos/videos/domain/models/write/video-url';

export class VideoUrlMother {
    static create(value?: string): VideoURL {
        return new VideoURL(value ?? faker.internet.url());
    }
}
