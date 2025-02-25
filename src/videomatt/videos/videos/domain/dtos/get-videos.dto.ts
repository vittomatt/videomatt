import { DTO } from '@videomatt/shared/domain/dtos/dto';

// FITU here
export class GetVideosDTO extends DTO {
    constructor(public readonly userId: string) {
        super();
    }
}
