export type EventPrefix = 'video' | 'user';

export abstract class DomainEvent {
    public readonly id: string;
    public readonly occurredOn: Date;
    public readonly userId: string;
    public abstract readonly eventName: string;

    protected constructor(id: string, userId: string, occurredOn?: Date) {
        this.id = id;
        this.userId = userId;
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
        const service = eventParts[1];
        return service;
    }

    abstract isLocal(): boolean;

    abstract isRemote(): boolean;
}
