import { StringMother } from '@tests/shared/string.mother';
import { VideoDescription } from '@videos/videos/domain/models/video-description';

export class VideoDescriptionMother {
    static create(value?: string): VideoDescription {
        return new VideoDescription(value ?? StringMother.random());
    }
}
