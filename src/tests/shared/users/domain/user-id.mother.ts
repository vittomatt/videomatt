import { faker } from '@faker-js/faker';

import { UserId } from '@videomatt/users/domain/models/write/user-id';

export class UserIdMother {
    static create(value?: string): UserId {
        return new UserId(value ?? faker.string.uuid());
    }
}
