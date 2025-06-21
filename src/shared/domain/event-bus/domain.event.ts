export type EventPrefix = 'video' | 'user';

const COMPANY_INDEX = 0;
const SERVICE_INDEX = 1;
const VERSION_INDEX = 2;
const TYPE_INDEX = 3;
const ENTITY_INDEX = 4;
const EVENT_INDEX = 5;

export abstract class DomainEvent {
    static readonly eventName: string;

    public readonly id: string;
    public readonly occurredOn: Date;
    public readonly userId: string;

    protected constructor(id: string, userId: string, occurredOn?: Date) {
        this.id = id;
        this.userId = userId;
        this.occurredOn = occurredOn ?? new Date();
    }

    public getCompany(): string {
        const ctor = this.constructor as typeof DomainEvent;
        const eventParts = ctor.eventName.split('.');
        const company = eventParts[COMPANY_INDEX];
        return company;
    }

    public getService(): string {
        const ctor = this.constructor as typeof DomainEvent;
        const eventParts = ctor.eventName.split('.');
        const service = eventParts[SERVICE_INDEX];
        return service;
    }

    public getVersion(): string {
        const ctor = this.constructor as typeof DomainEvent;
        const eventParts = ctor.eventName.split('.');
        const version = eventParts[VERSION_INDEX];
        return version;
    }

    public getType(): string {
        const ctor = this.constructor as typeof DomainEvent;
        const eventParts = ctor.eventName.split('.');
        const type = eventParts[TYPE_INDEX];
        return type;
    }

    public getEntity(): string {
        const ctor = this.constructor as typeof DomainEvent;
        const eventParts = ctor.eventName.split('.');
        const entity = eventParts[ENTITY_INDEX];
        return entity;
    }

    public getEvent(): string {
        const ctor = this.constructor as typeof DomainEvent;
        const eventParts = ctor.eventName.split('.');
        const event = eventParts[EVENT_INDEX];
        return event;
    }

    abstract isLocal(): boolean;

    abstract isRemote(): boolean;
}
