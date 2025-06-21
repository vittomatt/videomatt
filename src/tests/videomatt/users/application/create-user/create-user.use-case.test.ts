import 'reflect-metadata';

import { faker } from '@faker-js/faker';
import { DomainEventBus } from '@shared/domain/event-bus/domain-event-bus';
import { UserMother } from '@tests/shared/users/domain/user.mother';
import { CreateUserUseCase } from '@users/application/create-user/create-user.use-case';
import { UserAlreadyExistsError } from '@users/domain/errors/user-already-exists.error';
import { UserCreatedEvent } from '@users/domain/events/user-created.event';
import { User } from '@users/domain/models/user';
import { UserRepository } from '@users/domain/repositories/user.repository';

import { ok } from 'neverthrow';
import { Mock, expect, vi } from 'vitest';

describe('CreateUserUseCase', () => {
    let repository: UserRepository<User>;
    let eventBus: DomainEventBus;
    let useCase: CreateUserUseCase;

    beforeEach(() => {
        repository = {
            searchById: vi.fn(),
            add: vi.fn(),
            remove: vi.fn(),
            update: vi.fn(),
            search: vi.fn(),
        };

        eventBus = {
            publish: vi.fn(),
            registerLocalPublisher: vi.fn(),
            registerRemoteProducer: vi.fn(),
        };

        useCase = new CreateUserUseCase(repository, eventBus);
    });

    afterEach(() => vi.clearAllMocks());

    it('should return UserAlreadyExistsError if the user already exists', async () => {
        // Given
        const userId = faker.string.uuid();
        const existingUser = UserMother.create({ id: userId });

        vi.mocked(repository.searchById).mockResolvedValue(ok(existingUser.toPrimitives()));

        // When
        try {
            await useCase.execute(existingUser.toPrimitives());
        } catch (error) {
            expect(error).toBeInstanceOf(UserAlreadyExistsError);
        }

        // Then
        expect(repository.searchById).toHaveBeenCalledExactlyOnceWith(userId);
        expect(eventBus.publish).not.toHaveBeenCalled();
    });

    it('should create a new user if it does not exist', async () => {
        // Given
        const userId = faker.string.uuid();
        const newUser = UserMother.create({ id: userId });

        vi.mocked(repository.searchById).mockResolvedValue(ok(null));
        vi.mocked(repository.add).mockResolvedValue(ok());

        // When
        await useCase.execute(newUser.toPrimitives());

        // Then
        expect(repository.searchById).toHaveBeenCalledExactlyOnceWith(userId);
        expect(repository.add).toHaveBeenCalledOnce();

        const addedUser: User = (repository.add as Mock).mock.calls[0][0];
        expect(addedUser).toBeInstanceOf(User);
        expect(addedUser.id.value).toBe(userId);

        expect(eventBus.publish).toHaveBeenCalledOnce();

        const publishedEvents = (eventBus.publish as Mock).mock.calls[0][0];
        const [firstEvent] = publishedEvents;
        expect(firstEvent).toBeInstanceOf(UserCreatedEvent);
    });
});
