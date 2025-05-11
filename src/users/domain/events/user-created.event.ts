import { DomainEvent } from '@shared/domain/event-bus/domain.event';

export class UserCreatedEvent extends DomainEvent {
    static readonly eventName = 'videomatt.users.1.event.user.created';
    public readonly eventName = UserCreatedEvent.eventName;

    private constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly firstName: string,
        public readonly lastName: string
    ) {
        super(id, userId);
    }

    static create({
        id,
        userId,
        firstName,
        lastName,
    }: {
        id: string;
        userId: string;
        firstName: string;
        lastName: string;
    }): UserCreatedEvent {
        return new UserCreatedEvent(id, userId, firstName, lastName);
    }

    isLocal(): boolean {
        return false;
    }

    isRemote(): boolean {
        return true;
    }
}
