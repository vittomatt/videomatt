import { BaseCommandDTO, DTO } from '@videomatt/shared/domain/dtos/dto';

export class AddCommentToVideoDTO extends DTO implements BaseCommandDTO {
    public readonly type = 'AddCommentToVideoDTO';

    private constructor(
        public readonly id: string,
        public readonly text: string,
        public readonly videoId: string,
        public readonly userId: string
    ) {
        super();
    }

    static create({ id, text, videoId, userId }: { id: string; text: string; videoId: string; userId: string }) {
        return new AddCommentToVideoDTO(id, text, videoId, userId);
    }
}
