import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain.event';

export class UserCreatedEvent extends DomainEvent {
    static readonly eventName = 'videomatt.user.1.event.user.created';
    public readonly eventName = UserCreatedEvent.eventName;

    private constructor(
        public readonly id: string,
        public readonly firstName: string,
        public readonly lastName: string
    ) {
        super();
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
