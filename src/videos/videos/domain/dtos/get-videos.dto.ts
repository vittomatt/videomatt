import { DTO } from '@shared/domain/dtos/dto';

export class GetVideosDTO extends DTO {
    static readonly type = 'GetVideosDTO';

    constructor(public readonly userId: string) {
        super();
    }
}
