import { faker } from '@faker-js/faker';
import { VideoDescription } from '@videos/videos/domain/models/video-description';

export class VideoDescriptionMother {
    static create(value?: string): VideoDescription {
        return new VideoDescription(value ?? faker.lorem.sentence());
    }
}
