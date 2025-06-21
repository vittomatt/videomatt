import { PrimitivesMother } from '@tests/shared/primitives.mother';
import { VideoId } from '@videos/videos/domain/models/video-id';

export class VideoIdMother {
    static create(value?: string): VideoId {
        return new VideoId(value ?? PrimitivesMother.randomUUID());
    }
}
