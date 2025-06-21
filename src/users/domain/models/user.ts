import { AggregateRoot } from '@shared/domain/aggregate-root';
import { ExtractOptionalPrimitives, ExtractPrimitives } from '@shared/domain/models/extract-primitives';
import { UserId } from '@shared/domain/models/user-id';
import { UserCreatedEvent } from '@users/domain/events/user-created.event';
import { UserAmountOfVideo } from '@users/domain/models/user-amount-of-videos';
import { UserFirstName } from '@users/domain/models/user-first-name';
import { UserLastName } from '@users/domain/models/user-last-name';

export type UserPrimitives = ExtractOptionalPrimitives<User>;

export class User extends AggregateRoot<User> {
    constructor(
        public readonly id: UserId,
        public readonly firstName: UserFirstName,
        public readonly lastName: UserLastName,
        public amountOfVideos: UserAmountOfVideo
    ) {
        super();
    }

    static create({
        id,
        firstName,
        lastName,
        amountOfVideos,
    }: {
        id: string;
        firstName: string;
        lastName: string;
        amountOfVideos?: number;
    }): User {
        const user = new User(
            new UserId(id),
            new UserFirstName(firstName),
            new UserLastName(lastName),
            new UserAmountOfVideo(amountOfVideos ?? 0)
        );

        const event = UserCreatedEvent.create({ id, userId: id, firstName, lastName });
        user.record(event);

        return user;
    }

    static fromPrimitives({ id, firstName, lastName, amountOfVideos }: ExtractPrimitives<User>): User {
        return new User(
            new UserId(id),
            new UserFirstName(firstName),
            new UserLastName(lastName),
            new UserAmountOfVideo(amountOfVideos)
        );
    }

    toPrimitives(): ExtractPrimitives<User> {
        return {
            id: this.id.value,
            firstName: this.firstName.value,
            lastName: this.lastName.value,
            amountOfVideos: this.amountOfVideos.value,
        };
    }

    increaseAmountOfVideos() {
        const newAmountOfVideos = this.amountOfVideos.value + 1;
        this.amountOfVideos = new UserAmountOfVideo(newAmountOfVideos);
    }
}
