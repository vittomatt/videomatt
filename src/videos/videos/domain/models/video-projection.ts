import { VideoAmountOfComments } from './video-amount-of-comments';
import { VideoDescription } from './video-description';
import { VideoId } from './video-id';
import { VideoTitle } from './video-title';
import { VideoURL } from './video-url';

import { ExtractOptionalPrimitives, ExtractPrimitives } from '@shared/domain/models/extract-primitives';
import { UserId } from '@shared/domain/models/user-id';

export type VideoProjectionPrimitives = ExtractOptionalPrimitives<VideoProjection>;

export class VideoProjection {
    constructor(
        public readonly id: VideoId,
        public readonly title: VideoTitle,
        public readonly description: VideoDescription,
        public readonly url: VideoURL,
        public readonly userId: UserId,
        public amountOfComments: VideoAmountOfComments
    ) {}

    static create({
        id,
        title,
        description,
        url,
        userId,
        amountOfComments = 0,
    }: {
        id: string;
        title: string;
        description: string;
        url: string;
        userId: string;
        amountOfComments?: number;
    }): VideoProjection {
        const videoProjection = new VideoProjection(
            new VideoId(id),
            new VideoTitle(title),
            new VideoDescription(description),
            new VideoURL(url),
            new UserId(userId),
            new VideoAmountOfComments(amountOfComments)
        );

        return videoProjection;
    }

    static fromPrimitives({
        id,
        title,
        description,
        url,
        userId,
        amountOfComments,
    }: ExtractPrimitives<VideoProjection>): VideoProjection {
        return new VideoProjection(
            new VideoId(id),
            new VideoTitle(title),
            new VideoDescription(description),
            new VideoURL(url),
            new UserId(userId),
            new VideoAmountOfComments(amountOfComments)
        );
    }

    toPrimitives(): ExtractPrimitives<VideoProjection> {
        return {
            id: this.id.value,
            title: this.title.value,
            description: this.description.value,
            url: this.url.value,
            userId: this.userId.value,
            amountOfComments: this.amountOfComments.value,
        };
    }

    increaseAmountOfComments() {
        const newAmountOfComments = this.amountOfComments.value + 1;
        this.amountOfComments = new VideoAmountOfComments(newAmountOfComments);
    }
}
