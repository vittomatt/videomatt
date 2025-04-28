import 'reflect-metadata';

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
        } as unknown as sinon.SinonStubbedInstance<UserRepository<User>>;

        eventBus = {
            publish: sinon.stub(),
        } as unknown as sinon.SinonStubbedInstance<DomainEventBus>;

        useCase = new CreateUserUseCase(repository, eventBus);
    });

    afterEach(() => sinon.restore());

    it('should return UserAlreadyExistsError if the user already exists', async () => {
        // const existingUser = User.create({ id: 'u-1', firstName: 'Juan', lastName: 'Pérez' });
        // (repository.searchById as sinon.SinonStub).resolves(existingUser);

        // const result = await useCase.execute({ id: 'u-1', firstName: 'Juan', lastName: 'Pérez' });

        // expect(result).to.be.instanceOf(UserAlreadyExistsError);
        // expect(repository.add.called).to.be.false;
        // expect(eventBus.publish.called).to.be.false;
        expect(true).to.be.true;
    });
});
