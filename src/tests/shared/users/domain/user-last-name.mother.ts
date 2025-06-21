import { StringMother } from '@tests/shared/string.mother';
import { UserLastName } from '@users/domain/models/user-last-name';

export class UserLastNameMother {
    static create(value?: string): UserLastName {
        return new UserLastName(value ?? StringMother.lastName());
    }
}
