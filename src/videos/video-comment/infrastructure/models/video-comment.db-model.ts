import { Document, Schema, model } from 'mongoose';

export const VIDEO_COMMENT_COLLECTION_NAME = 'comments';
export const VIDEO_COMMENT_MODEL_NAME = 'VideoComment';

export interface VideoCommentDBDocument extends Document {
    _id: string;
    text: string;
    videoId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

const VideoCommentSchema = new Schema<VideoCommentDBDocument>(
    {
        _id: { type: String, required: true, unique: true },
        text: { type: String, required: true },
        videoId: { type: String, required: true },
        userId: { type: String, required: true },
    },
    {
        timestamps: true,
        collection: VIDEO_COMMENT_COLLECTION_NAME,
    }
);

export class VideoComment {
    private readonly document: VideoCommentDBDocument;

    constructor(document: VideoCommentDBDocument) {
        this.document = document;
    }

    toPrimitives() {
        return {
            id: this.document._id,
            text: this.document.text,
            videoId: this.document.videoId,
            userId: this.document.userId,
        };
    }

    get createdAt() {
        return this.document.createdAt;
    }
}

export const VideoCommentModel = model<VideoCommentDBDocument>(VIDEO_COMMENT_MODEL_NAME, VideoCommentSchema);
