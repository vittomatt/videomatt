import { DomainEvent } from '@shared/domain/event-bus/domain.event';

export class UserCreatedEvent extends DomainEvent {
    static readonly eventName = 'videomatt.users.1.event.user.created';
    public readonly eventName = UserCreatedEvent.eventName;

    private constructor(
        public id: string,
        public readonly firstName: string,
        public readonly lastName: string
    ) {
        super(id);
    }

    static create({ id, firstName, lastName }: { id: string; firstName: string; lastName: string }): UserCreatedEvent {
        return new UserCreatedEvent(id, firstName, lastName);
    }

    isLocal(): boolean {
        return false;
    }

    isRemote(): boolean {
        return true;
    }
}
