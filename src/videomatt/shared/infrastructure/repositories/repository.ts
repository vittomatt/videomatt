import { Criteria } from '@videomatt/shared/domain/repositories/criteria';
import { Option } from 'fp-ts/lib/Option';

export interface Repository<T> {
    add(item: T): Promise<void>;
    remove(item: T): Promise<void>;
    update(item: T): Promise<void>;
    search(criteria: Criteria): Promise<T[]>;
    searchById(criteria: Criteria): Promise<Option<T>>;
}

export interface RawRepository<T> {
    raw(id: string): Promise<Option<T>>;
}
