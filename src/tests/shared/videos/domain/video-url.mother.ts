import { PrimitivesMother } from '@tests/shared/primitives.mother';
import { VideoURL } from '@videos/videos/domain/models/video-url';

export class VideoUrlMother {
    static create(value?: string): VideoURL {
        return new VideoURL(value ?? PrimitivesMother.randomUrl());
    }
}
