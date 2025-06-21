import { StringMother } from '@tests/shared/string.mother';
import { UserFirstName } from '@users/domain/models/user-first-name';

export class UserFirstNameMother {
    static create(value?: string): UserFirstName {
        return new UserFirstName(value ?? StringMother.firstName());
    }
}
