import { DTO } from '@shared/domain/dtos/dto';

export interface QueryHandler<T> {
    handle(dto: DTO): Promise<T>;
}
