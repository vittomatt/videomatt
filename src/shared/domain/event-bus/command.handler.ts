import { DTO } from '@shared/domain/dtos/dto';
import { DomainError } from '@shared/domain/errors/domain.error';

export interface CommandHandler<E extends DomainError> {
    handle(dto: DTO): Promise<E | void>;
}
