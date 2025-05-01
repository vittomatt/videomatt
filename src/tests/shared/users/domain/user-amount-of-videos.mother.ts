import { faker } from '@faker-js/faker';
import { UserAmountOfVideo } from '@users/domain/models/write/user-amount-of-videos';

export class UserAmountOfVideosMother {
    static create(value?: number): UserAmountOfVideo {
        return new UserAmountOfVideo(value ?? faker.number.int({ min: 0, max: 10 }));
    }
}
