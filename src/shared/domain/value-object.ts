import { InvalidArgumentError } from './errors/invalid-argument.error';

type Primitive = string | number | boolean | Date;

export abstract class ValueObject<T extends Primitive> {
    readonly value: T;

    constructor(value: T) {
        this.value = value;
        this.ensureValueIsDefined(value);
    }

    private ensureValueIsDefined(value: T) {
        if (value === undefined || value === null) {
            throw new InvalidArgumentError(this.constructor.name);
        }
    }

    equals(other: ValueObject<T>): boolean {
        return this.constructor.name === other.constructor.name && this.value === other.value;
    }

    toString(): string {
        return this.value.toString();
    }

    toPrimitives(): Record<string, unknown> {
        const entries = Object.entries(this);
        const result: Record<string, unknown> = {};
        for (const [key, val] of entries) {
            if (val && typeof val === 'object' && 'value' in val) {
                result[key] = (val as { value: unknown }).value;
            } else {
                result[key] = val;
            }
        }
        return result;
    }
}
