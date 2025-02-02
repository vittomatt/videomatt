import { DTO } from '@videomatt/shared/domain/dtos/dto';

export interface QueryEventBus<T> {
    publish(dto: DTO): Promise<T>;
}
