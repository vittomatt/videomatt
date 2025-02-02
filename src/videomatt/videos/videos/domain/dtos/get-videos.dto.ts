import { DTO } from '@videomatt/shared/domain/dtos/dto';

export class GetVideosDTO extends DTO {
    constructor(public readonly userId: string) {
        super();
    }
}
