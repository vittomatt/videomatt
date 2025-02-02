import { DomainEvent } from '@videomatt/shared/domain/event-bus/domain-event';

export class UserCreatedEvent extends DomainEvent {
    private constructor(
        public readonly id: string,
        public readonly firstName: string,
        public readonly lastName: string
    ) {
        const eventName = 'videomatt.user.1.event.user.created';
        super(eventName);
    }

    static create({ id, firstName, lastName }: { id: string; firstName: string; lastName: string }): UserCreatedEvent {
        return new UserCreatedEvent(id, firstName, lastName);
    }
}
