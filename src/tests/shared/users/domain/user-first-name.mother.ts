import { faker } from '@faker-js/faker';
import { UserFirstName } from '@users/domain/models/user-first-name';

export class UserFirstNameMother {
    static create(value?: string): UserFirstName {
        return new UserFirstName(value ?? faker.person.firstName());
    }
}
