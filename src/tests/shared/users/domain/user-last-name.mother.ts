import { faker } from '@faker-js/faker';
import { UserLastName } from '@users/domain/models/user-last-name';

export class UserLastNameMother {
    static create(value?: string): UserLastName {
        return new UserLastName(value ?? faker.person.lastName());
    }
}
