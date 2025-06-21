import { faker } from '@faker-js/faker';

export class PrimitivesMother {
    static randomString(length: number = 10): string {
        return faker.string.alphanumeric(length);
    }

    static randomUUID(): string {
        return faker.string.uuid();
    }

    static randomNumber(min: number = 0, max: number = 1000): number {
        return faker.number.int({ min, max });
    }

    static randomBoolean(): boolean {
        return faker.datatype.boolean();
    }

    static randomDate(): Date {
        return faker.date.recent();
    }

    static randomEmail(): string {
        return faker.internet.email();
    }

    static randomUrl(): string {
        return faker.internet.url();
    }
}
