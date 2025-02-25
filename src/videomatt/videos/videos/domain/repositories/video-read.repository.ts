import { Criteria } from '@videomatt/shared/domain/repositories/criteria';
import { Option } from 'fp-ts/lib/Option';

export type VideoReadRepository<T> = {
    check(id: string): Promise<boolean>;
    save(id: string): Promise<void>;
    search(criteria: Criteria): Promise<T[]>;
    searchById(criteria: Criteria): Promise<Option<T>>;
    add(item: T): Promise<void>;
    update(item: T): Promise<void>;
};
