import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain-event';
import { User } from '@videomatt/users/domain/models/user';

export class UserCreatedEvent extends DomainEvent {
    public readonly userId: string;

    constructor(user: User) {
        const eventName = 'user.created';
        super(eventName);
        this.userId = user.id.value;
    }
}
