import { DTO } from '@videomatt/shared/domain/dtos/dto';

export interface CommandHandler {
    handle(dto: DTO): Promise<void>;
}
