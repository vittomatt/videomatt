import { DTO } from '@videomatt/shared/domain/dtos/dto';

export class CreateUserDTO extends DTO {
    static readonly type = 'CreateUserDTO';

    private constructor(
        public readonly id: string,
        public readonly firstName: string,
        public readonly lastName: string
    ) {
        super();
    }

    static create({ id, firstName, lastName }: { id: string; firstName: string; lastName: string }) {
        return new CreateUserDTO(id, firstName, lastName);
    }
}
