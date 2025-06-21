import { StringMother } from '@tests/shared/string.mother';
import { VideoTitle } from '@videos/videos/domain/models/video-title';

export class VideoTitleMother {
    static create(value?: string): VideoTitle {
        return new VideoTitle(value ?? StringMother.random());
    }
}
