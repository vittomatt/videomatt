import { UnexpectedError } from '@shared/domain/errors/unexpected.error';

export function assertNever(value: never): never {
    throw new UnexpectedError('Unexpected value: ' + value);
}
