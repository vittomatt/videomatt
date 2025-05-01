import { DomainError } from '@shared/domain/errors/domain.error';

export class NegativeAmountOfVideosError extends DomainError {
    public readonly type = 'NegativeAmountOfVideosError';
    public readonly message = 'Amount of videos cannot be negative';
}
