import { DTO } from '@shared/domain/dtos/dto';

export class GetVideosDTO extends DTO {
    static readonly type = 'GetVideosDTO';

    // FITU: filter by user id
    constructor(public readonly userId: string) {
        super();
    }
}
