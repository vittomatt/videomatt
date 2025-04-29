import 'reflect-metadata';

import { faker } from '@faker-js/faker';
import { UserMother } from '@tests/shared/users/domain/user.mother';

import { expect } from 'chai';
import sinon from 'sinon';

import { DomainEventBus } from '@videomatt/shared/domain/event-bus/domain-event-bus';
import { CreateUserUseCase } from '@videomatt/users/application/create-user/create-user.use-case';
import { UserAlreadyExistsError } from '@videomatt/users/domain/errors/user-already-exists.error';
import { User } from '@videomatt/users/domain/models/write/user';
import { UserRepository } from '@videomatt/users/domain/repositories/user.repository';

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

        repository.searchById.resolves(existingUser);

        // When
        const result = await useCase.execute({
            id: userId,
            firstName: existingUser.firstName.value,
            lastName: existingUser.lastName.value,
        });

        // Then
        expect(result).to.be.instanceOf(UserAlreadyExistsError);
        expect(repository.searchById).to.have.been.calledOnceWithExactly(userId);
        expect(eventBus.publish).to.not.have.been.called;
    });
});
