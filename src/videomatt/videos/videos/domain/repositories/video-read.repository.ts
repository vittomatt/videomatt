import { Criteria } from '@videomatt/shared/domain/repositories/criteria';

export type VideoReadRepository<T> = {
    search(criteria: Criteria): Promise<T[]>;
    add(item: T): Promise<void>;
    update(item: T): Promise<void>;
};
