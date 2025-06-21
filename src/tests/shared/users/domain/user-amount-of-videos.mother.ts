import { PrimitivesMother } from '@tests/shared/primitives.mother';
import { UserAmountOfVideo } from '@users/domain/models/user-amount-of-videos';

export class UserAmountOfVideosMother {
    static create(value?: number): UserAmountOfVideo {
        return new UserAmountOfVideo(value ?? PrimitivesMother.randomNumber(0, 10));
    }
}
