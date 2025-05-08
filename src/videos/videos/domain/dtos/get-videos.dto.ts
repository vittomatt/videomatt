import { DTO } from '@shared/domain/dtos/dto';

export class GetVideosDTO extends DTO {
    static readonly type = 'GetVideosDTO';

    private constructor(public readonly userId: string) {
        super();
    }

    static create({ userId }: { userId: string }) {
        return new GetVideosDTO(userId);
    }
}
