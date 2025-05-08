import { DTO } from '@shared/domain/dtos/dto';

export class GetUsersDTO extends DTO {
    static readonly type = 'GetUsersDTO';

    private constructor() {
        super();
    }

    static create() {
        return new GetUsersDTO();
    }
}
