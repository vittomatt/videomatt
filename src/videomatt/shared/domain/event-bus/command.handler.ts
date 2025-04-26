import { DomainError } from '@videomatt/shared/domain/errors/domain.error';
import { DTO } from '@videomatt/shared/domain/dtos/dto';

export interface CommandHandler<E extends DomainError> {
    handle(dto: DTO): Promise<E | void>;
}
