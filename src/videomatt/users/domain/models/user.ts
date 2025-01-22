import { AggregateRoot } from '@videomatt/shared/domain/aggregate-root';
import { UserCreatedEvent } from '@videomatt/users/domain/events/user-created.event';

import { UserId } from './user-id';
import { UserFirstName } from './user-first-name';
import { UserLastName } from './user-last-name';
import { UserAmountOfVideo } from './user-amount-of-videos';

export class User extends AggregateRoot {
    constructor(
        public readonly id: UserId,
        public readonly firstName: UserFirstName,
        public readonly lastName: UserLastName,
        public amountOfVideos: UserAmountOfVideo
    ) {
        super();
    }

    static create(id: string, firstName: string, lastName: string, amountOfVideos: number) {
        const user = new User(
            new UserId(id),
            new UserFirstName(firstName),
            new UserLastName(lastName),
            new UserAmountOfVideo(amountOfVideos)
        );

        const event = new UserCreatedEvent(user);
        user.record(event);

        return user;
    }

    static fromPrimitives(primitives: { id: string; firstName: string; lastName: string; amountOfVideos: number }) {
        return new User(
            new UserId(primitives.id),
            new UserFirstName(primitives.firstName),
            new UserLastName(primitives.lastName),
            new UserAmountOfVideo(primitives.amountOfVideos)
        );
    }

    toPrimitives() {
        return {
            id: this.id.value,
            title: this.firstName.value,
            description: this.lastName.value,
            url: this.amountOfVideos.value,
        };
    }

    increaseAmountOfVideos() {
        const newAmountOfVideos = this.amountOfVideos.value + 1;
        this.amountOfVideos = new UserAmountOfVideo(newAmountOfVideos);
    }
}
