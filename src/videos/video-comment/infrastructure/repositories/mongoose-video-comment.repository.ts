import { Logger } from '@shared/domain/logger/logger';
import { Criteria } from '@shared/domain/repositories/criteria';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { MongooseCriteriaConverter } from '@shared/infrastructure/repositories/mongoose-criteria.converte';
import { VideoComment } from '@videos/video-comment/domain/models/write/video-comment';
import { VIDEO_COMMENT_TOKENS } from '@videos/video-comment/infrastructure/di/video-comment.tokens';
import { VideoCommentModel } from '@videos/video-comment/infrastructure/models/video-comment.db-model';
import { VideoCommentRepository } from '@videos/video-comment/infrastructure/repositories/video-comment.repository';

import { inject, injectable } from 'tsyringe';

@injectable()
export class MongoDBVideoCommentRepository implements VideoCommentRepository<VideoComment> {
    constructor(
        @inject(VIDEO_COMMENT_TOKENS.DB_MODEL) private readonly dbVideoComment: typeof VideoCommentModel,
        @inject(TOKEN.LOGGER) private readonly logger: Logger
    ) {}

    async add(comment: VideoComment) {
        try {
            const commentPrimitives = comment.toPrimitives();
            await this.dbVideoComment.create({ ...commentPrimitives, _id: commentPrimitives.id });
        } catch (error) {
            this.logger.error(`Error adding video comment: ${error}`);
        }
    }

    async remove(comment: VideoComment) {
        const id = comment.id.value;

        try {
            await this.dbVideoComment.deleteOne({ _id: id });
        } catch (error) {
            this.logger.error(`Error removing video comment: ${error}`);
        }
    }

    async update(comment: VideoComment) {
        const commentPrimitives = comment.toPrimitives();

        try {
            await this.dbVideoComment.updateOne({ _id: commentPrimitives.id }, { $set: commentPrimitives });
        } catch (error) {
            this.logger.error(`Error updating video comment: ${error}`);
        }
    }

    async search(criteria: Criteria): Promise<VideoComment[]> {
        try {
            const comments = await this.convert(criteria);
            return comments;
        } catch (error) {
            this.logger.error(`Error searching video comments: ${error}`);
            return [];
        }
    }

    async searchById(id: string): Promise<VideoComment | null> {
        try {
            const commentModel = await this.dbVideoComment.findById<VideoComment>(id);
            const comment = commentModel ? VideoComment.fromPrimitives(commentModel.toPrimitives()) : null;
            return comment;
        } catch (error) {
            this.logger.error(`Error searching video comment by id: ${error}`);
            return null;
        }
    }

    private async convert(criteria: Criteria): Promise<VideoComment[]> {
        const converter = new MongooseCriteriaConverter(criteria);
        const { query, sort, skip, limit } = converter.build();

        const dbComments = await this.dbVideoComment.find<VideoComment>(query, {
            sort,
            skip,
            limit,
        });

        const comments = dbComments
            .map((comment) => comment.toPrimitives())
            .map((commentPrimitives) => VideoComment.fromPrimitives(commentPrimitives));
        return comments;
    }
}
