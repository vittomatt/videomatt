import { faker } from '@faker-js/faker';
import { UserId } from '@shared/domain/models/user-id';

export class UserIdMother {
    static create(value?: string): UserId {
        return new UserId(value ?? faker.string.uuid());
    }
}
