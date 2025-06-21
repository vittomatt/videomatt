import { UserId } from '@shared/domain/models/user-id';
import { PrimitivesMother } from '@tests/shared/primitives.mother';

export class UserIdMother {
    static create(value?: string): UserId {
        return new UserId(value ?? PrimitivesMother.randomUUID());
    }
}
