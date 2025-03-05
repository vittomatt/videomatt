import { DomainError } from '@videomatt/shared/domain/errors/domain.error';
import { DTO } from '@videomatt/shared/domain/dtos/dto';
import * as Effect from 'effect/Effect';

export interface QueryHandler<E extends DomainError, T> {
    handle(dto: DTO): Promise<Effect.Effect<T, E>>;
}
