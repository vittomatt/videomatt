import { BaseQueryDTO, DTO } from '@videomatt/shared/domain/dtos/dto';

export class GetVideosDTO extends DTO implements BaseQueryDTO {
    readonly type = 'GetVideosDTO';

    constructor(public readonly userId: string) {
        super();
    }
}
