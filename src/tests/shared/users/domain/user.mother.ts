import { UserAmountOfVideosMother } from './user-amount-of-videos.mother';
import { UserFirstNameMother } from './user-first-name.mother';
import { UserIdMother } from './user-id.mother';
import { UserLastNameMother } from './user-last-name.mother';

import { ExtractPrimitives } from '@shared/domain/models/extract-primitives';
import { User, UserPrimitives } from '@users/domain/models/write/user';

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
