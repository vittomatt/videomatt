import { DomainError } from '@videomatt/shared/domain/errors/domain.error';
import { DTO } from '@videomatt/shared/domain/dtos/dto';
import { Either } from 'fp-ts/lib/Either';

export interface CommandHandler<E extends DomainError> {
    handle(dto: DTO): Promise<Either<E, void>>;
}
