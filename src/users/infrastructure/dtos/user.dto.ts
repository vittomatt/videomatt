import { DTO } from '@shared/domain/dtos/dto';

export class UserDTO extends DTO {
    static readonly type = 'UserDTO';

    private constructor(
        public readonly id: string,
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly amountOfVideos: number
    ) {
        super();
    }

    static create({
        id,
        firstName,
        lastName,
        amountOfVideos,
    }: {
        id: string;
        firstName: string;
        lastName: string;
        amountOfVideos: number;
    }) {
        return new UserDTO(id, firstName, lastName, amountOfVideos);
    }
}
