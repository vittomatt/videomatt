import { faker } from '@faker-js/faker';
import { VideoId } from '@videos/videos/domain/models/video-id';

export class VideoIdMother {
    static create(value?: string): VideoId {
        return new VideoId(value ?? faker.string.uuid());
    }
}
