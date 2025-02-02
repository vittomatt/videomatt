import { DTO } from '@videomatt/shared/domain/dtos/dto';

export interface CommandEventBus {
    publish(dto: DTO): Promise<void>;
}
