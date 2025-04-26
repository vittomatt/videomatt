import { DomainError } from '@videomatt/shared/domain/errors/domain.error';
import { DTO } from '@videomatt/shared/domain/dtos/dto';

export interface QueryHandler<E extends DomainError, T> {
    handle(dto: DTO): Promise<T | E>;
}
