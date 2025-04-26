import { Criteria } from '@videomatt/shared/domain/repositories/criteria';

export interface Repository<T> {
    add(item: T): Promise<void>;
    remove(item: T): Promise<void>;
    update(item: T): Promise<void>;
    search(criteria: Criteria): Promise<T[]>;
    searchById(id: string): Promise<T | null>;
}

export interface RawRepository<T> {
    raw(id: string): Promise<T>;
}
