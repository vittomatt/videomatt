import { DomainError } from '@shared/domain/errors/domain.error';

export class EmptyTextError extends DomainError {
    public readonly type = 'EmptyTextError';
    private readonly _message: string;

    constructor(fieldName: string) {
        super();
        this._message = `${fieldName} cannot be empty`;
    }

    public get message(): string {
        return this._message;
    }
}
