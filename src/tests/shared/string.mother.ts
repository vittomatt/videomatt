import { faker } from '@faker-js/faker';

export class StringMother {
    static random({ minLength = 0, maxLength = 100 }: { minLength?: number; maxLength?: number } = {}): string {
        return faker.lorem.word({ length: { min: minLength, max: maxLength } });
    }

    static firstName(): string {
        return faker.person.firstName();
    }

    static lastName(): string {
        return faker.person.lastName();
    }
}
