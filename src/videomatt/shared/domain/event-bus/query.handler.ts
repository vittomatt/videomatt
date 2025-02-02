import { DTO } from '@videomatt/shared/domain/dtos/dto';

export interface QueryHandler<T> {
    handle(dto: DTO): Promise<T>;
}
