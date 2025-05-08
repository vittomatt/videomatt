import 'reflect-metadata';

import { faker } from '@faker-js/faker';
import { DomainEventBus } from '@shared/domain/event-bus/domain-event-bus';
import { UserMother } from '@tests/shared/users/domain/user.mother';
import { CreateUserUseCase } from '@users/application/create-user/create-user.use-case';
import { UserAlreadyExistsError } from '@users/domain/errors/user-already-exists.error';
import { UserCreatedEvent } from '@users/domain/events/user-created.event';
import { User } from '@users/domain/models/write/user';
import { UserRepository } from '@users/domain/repositories/user.repository';

import { expect } from 'chai';
import { ok } from 'neverthrow';
import sinon from 'sinon';

describe('CreateUserUseCase', () => {
    let repository: sinon.SinonStubbedInstance<UserRepository<User>>;
    let eventBus: sinon.SinonStubbedInstance<DomainEventBus>;
    let useCase: CreateUserUseCase;

    beforeEach(() => {
        repository = {
            searchById: sinon.stub(),
            add: sinon.stub(),
            remove: sinon.stub(),
            update: sinon.stub(),
            search: sinon.stub(),
        } as sinon.SinonStubbedInstance<UserRepository<User>>;

        eventBus = {
            publish: sinon.stub(),
        } as sinon.SinonStubbedInstance<DomainEventBus>;

        useCase = new CreateUserUseCase(repository, eventBus);
    });

    afterEach(() => sinon.restore());

    it('should return UserAlreadyExistsError if the user already exists', async () => {
        // Given
        const userId = faker.string.uuid();
        const existingUser = UserMother.create({ id: userId });

        repository.searchById.resolves(ok(existingUser));

        // When
        const result = await useCase.execute(existingUser.toPrimitives());

        // Then
        expect(result).to.be.instanceOf(UserAlreadyExistsError);
        expect(repository.searchById).to.have.been.calledOnceWithExactly(userId);
        expect(eventBus.publish).to.not.have.been.called;
    });

    it('should create a new user if it does not exist', async () => {
        // Given
        const userId = faker.string.uuid();
        const newUser = UserMother.create({ id: userId });

        repository.searchById.resolves(ok(null));

        // When
        await useCase.execute(newUser.toPrimitives());

        // Then
        expect(repository.searchById).to.have.been.calledOnceWithExactly(userId);
        expect(repository.add).to.have.been.calledOnce;

        const addedUser: User = repository.add.firstCall.args[0];
        expect(addedUser).to.be.instanceOf(User);
        expect(addedUser.id.value).to.equal(userId);

        expect(eventBus.publish).to.have.been.calledOnce;

        const publishedEvents = eventBus.publish.firstCall.args[0];
        const [firstEvent] = publishedEvents;
        expect(firstEvent).to.be.instanceOf(UserCreatedEvent);
    });
});
