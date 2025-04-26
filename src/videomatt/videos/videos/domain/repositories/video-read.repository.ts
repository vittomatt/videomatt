import { Criteria } from '@videomatt/shared/domain/repositories/criteria';

export type VideoReadRepository<T> = {
    check(id: string): Promise<boolean>;
    save(id: string): Promise<void>;
    search(criteria: Criteria): Promise<T[]>;
    searchById(id: string): Promise<T | null>;
    add(item: T): Promise<void>;
    update(item: T): Promise<void>;
};
