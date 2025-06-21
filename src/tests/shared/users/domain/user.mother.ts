import { ExtractPrimitives } from '@shared/domain/models/extract-primitives';
import { UserAmountOfVideosMother } from '@tests/shared/users/domain/user-amount-of-videos.mother';
import { UserFirstNameMother } from '@tests/shared/users/domain/user-first-name.mother';
import { UserIdMother } from '@tests/shared/users/domain/user-id.mother';
import { UserLastNameMother } from '@tests/shared/users/domain/user-last-name.mother';
import { User, UserPrimitives } from '@users/domain/models/user';

export class UserMother {
    static create(params?: Partial<UserPrimitives>): User {
        const primitives: UserPrimitives = {
            id: params?.id ?? UserIdMother.create().value,
            firstName: params?.firstName ?? UserFirstNameMother.create().value,
            lastName: params?.lastName ?? UserLastNameMother.create().value,
            amountOfVideos: params?.amountOfVideos ?? UserAmountOfVideosMother.create().value,
            ...params,
        };

        return User.fromPrimitives(primitives as ExtractPrimitives<User>);
    }
}
