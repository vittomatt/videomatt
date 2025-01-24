export type EventPrefix = 'video' | 'user';

export class DomainEvent {
    public readonly occurredOn: Date;

    protected constructor(
        public readonly eventName: string,
        occurredOn?: Date
    ) {
        this.occurredOn = occurredOn ?? new Date();
    }

    /**
     * [0] company
     * [1] service
     * [2] version
     * [3] type (event | command)
     * [4] entity
     * [5] event
     */
    public getEntity(): string {
        const eventParts = this.eventName.split('.');
        const entity = eventParts[4];
        return entity;
    }
}
