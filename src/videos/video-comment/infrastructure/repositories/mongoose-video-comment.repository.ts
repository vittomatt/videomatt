import { UnexpectedError } from '@shared/domain/errors/unexpected.error';
import { Logger } from '@shared/domain/logger/logger';
import { Criteria } from '@shared/domain/repositories/criteria';
import { TOKEN } from '@shared/infrastructure/di/tokens';
import { MongooseCriteriaConverter } from '@shared/infrastructure/repositories/mongoose-criteria.converte';
import { VideoComment, VideoCommentPrimitives } from '@videos/video-comment/domain/models/video-comment';
import { VIDEO_COMMENT_TOKENS } from '@videos/video-comment/infrastructure/di/video-comment.tokens';
import { VideoCommentModel } from '@videos/video-comment/infrastructure/models/video-comment.db-model';
import { VideoCommentRepository } from '@videos/video-comment/infrastructure/repositories/video-comment.repository';

import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

@injectable()
export class MongoDBVideoCommentRepository implements VideoCommentRepository<VideoComment> {
    constructor(
        @inject(VIDEO_COMMENT_TOKENS.DB_MODEL) private readonly dbVideoComment: typeof VideoCommentModel,
        @inject(TOKEN.LOGGER) private readonly logger: Logger
    ) {}

    async add(comment: VideoComment): Promise<Result<void, UnexpectedError>> {
        try {
            const commentPrimitives = comment.toPrimitives();
            await this.dbVideoComment.create({ ...commentPrimitives, _id: commentPrimitives.id });
            return ok(undefined);
        } catch (error) {
            this.logger.error(`Error adding video comment: ${error}`);
            return err(new UnexpectedError('Error adding video comment'));
        }
    }

    async remove(comment: VideoComment): Promise<Result<void, UnexpectedError>> {
        const id = comment.id.value;

        try {
            await this.dbVideoComment.deleteOne({ _id: id });
            return ok(undefined);
        } catch (error) {
            this.logger.error(`Error removing video comment: ${error}`);
            return err(new UnexpectedError('Error removing video comment'));
        }
    }

    async update(comment: VideoComment): Promise<Result<void, UnexpectedError>> {
        const commentPrimitives = comment.toPrimitives();

        try {
            await this.dbVideoComment.updateOne({ _id: commentPrimitives.id }, { $set: commentPrimitives });
            return ok(undefined);
        } catch (error) {
            this.logger.error(`Error updating video comment: ${error}`);
            return err(new UnexpectedError('Error updating video comment'));
        }
    }

    async search(criteria: Criteria): Promise<Result<VideoCommentPrimitives[], UnexpectedError>> {
        try {
            const comments = await this.convert(criteria);
            return ok(comments);
        } catch (error) {
            this.logger.error(`Error searching video comments: ${error}`);
            return err(new UnexpectedError('Error searching video comments'));
        }
    }

    async searchById(id: string): Promise<Result<VideoCommentPrimitives | null, UnexpectedError>> {
        try {
            const commentModel = await this.dbVideoComment.findById<VideoComment>(id);
            const comment = commentModel ? commentModel.toPrimitives() : null;
            return ok(comment);
        } catch (error) {
            this.logger.error(`Error searching video comment by id: ${error}`);
            return err(new UnexpectedError('Error searching video comment by id'));
        }
    }

    private async convert(criteria: Criteria): Promise<VideoCommentPrimitives[]> {
        const converter = new MongooseCriteriaConverter(criteria);
        const { query, sort, skip, limit } = converter.build();

        const dbComments = await this.dbVideoComment.find<VideoComment>(query, {
            sort,
            skip,
            limit,
        });

        return dbComments.map((comment) => comment.toPrimitives());
    }
}
