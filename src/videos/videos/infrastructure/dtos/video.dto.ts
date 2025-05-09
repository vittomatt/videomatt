import { DTO } from '@shared/domain/dtos/dto';

export class VideoDTO extends DTO {
    static readonly type = 'VideoDTO';

    private constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly description: string,
        public readonly url: string,
        public readonly userId: string,
        public readonly amountOfComments: number
    ) {
        super();
    }

    static create({
        id,
        title,
        description,
        url,
        userId,
        amountOfComments,
    }: {
        id: string;
        title: string;
        description: string;
        url: string;
        userId: string;
        amountOfComments: number;
    }) {
        return new VideoDTO(id, title, description, url, userId, amountOfComments);
    }
}
