import { DomainError } from '@shared/domain/errors/domain.error';

export class NegativeAmountOfVideosError extends DomainError {
    static readonly type = 'NegativeAmountOfVideosError';

    constructor() {
        super(NegativeAmountOfVideosError.type, 'Amount of videos cannot be negative');
    }
}
