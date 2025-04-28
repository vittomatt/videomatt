import { DTO } from '@videomatt/shared/domain/dtos/dto';
import { DomainError } from '@videomatt/shared/domain/errors/domain.error';

export interface CommandHandler<E extends DomainError> {
    handle(dto: DTO): Promise<E | void>;
}
