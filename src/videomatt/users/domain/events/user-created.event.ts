import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain-event';
import { User } from '@videomatt/users/domain/models/user';

export class UserCreatedEvent extends DomainEvent {
    public readonly userId: string;

    private constructor(user: User) {
        const eventName = 'videomatt.user.1.event.user.created';
        super(eventName);
        this.userId = user.id.value;
    }

    static create(user: User): UserCreatedEvent {
        return new UserCreatedEvent(user);
    }
}
