import { UnexpectedError } from '@shared/domain/errors/unexpected.error';
import { ExtractOptionalPrimitives } from '@shared/domain/models/extract-primitives';
import { Criteria } from '@shared/domain/repositories/criteria';

import { Result } from 'neverthrow';

export interface Repository<T> {
    add(item: T): Promise<Result<void, UnexpectedError>>;
    remove(item: T): Promise<Result<void, UnexpectedError>>;
    update(item: T): Promise<Result<void, UnexpectedError>>;
    search(criteria: Criteria): Promise<Result<ExtractOptionalPrimitives<T>[], UnexpectedError>>;
    searchById(id: string): Promise<Result<ExtractOptionalPrimitives<T> | null, UnexpectedError>>;
}

export interface RawRepository<T> {
    raw(id: string): Promise<Result<ExtractOptionalPrimitives<T>, UnexpectedError>>;
}
