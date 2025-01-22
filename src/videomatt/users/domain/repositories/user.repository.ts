import { Criteria } from '@videomatt/shared/domain/repositories/criteria';

export interface UserRepository<T> {
    add(item: T): Promise<void>;
    remove(item: T): Promise<void>;
    update(item: T): Promise<void>;
    search(criteria: Criteria): Promise<T[]>;
}
