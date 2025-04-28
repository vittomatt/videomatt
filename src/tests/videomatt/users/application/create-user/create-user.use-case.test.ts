import { expect } from 'chai';
import 'reflect-metadata';
import sinon from 'sinon';

import { CreateUserUseCase } from '@videomatt/users/application/create-user/create-user.use-case';
import { UserAlreadyExistsError } from '@videomatt/users/domain/errors/user-already-exists.error';
import { UserRepository } from '@videomatt/users/domain/repositories/user.repository';
import { DomainEventBus } from '@videomatt/shared/domain/event-bus/domain-event-bus';
import { User } from '@videomatt/users/domain/models/write/user';

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

        useCase = new CreateUserUseCase(repository as any, eventBus as any);
    });

    afterEach(() => sinon.restore());

    it('should return UserAlreadyExistsError if the user already exists', async () => {
        const existingUser = User.create({ id: 'u-1', firstName: 'Juan', lastName: 'Pérez' });
        (repository.searchById as sinon.SinonStub).resolves(existingUser);

        const result = await useCase.execute({ id: 'u-1', firstName: 'Juan', lastName: 'Pérez' });

        expect(result).to.be.instanceOf(UserAlreadyExistsError);
        expect(repository.add.called).to.be.false;
        expect(eventBus.publish.called).to.be.false;
    });

    it('should create the user and publish events if the id is free', async () => {
        (repository.searchById as sinon.SinonStub).resolves(null);
        (repository.add as sinon.SinonStub).resolves();

        await useCase.execute({ id: 'u-2', firstName: 'Ana', lastName: 'García' });

        expect(repository.add.calledOnce).to.be.true;
        const addedUser = (repository.add as sinon.SinonStub).firstCall.args[0] as User;
        expect(addedUser.id).to.equal('u-2');

        expect(eventBus.publish.calledOnce).to.be.true;
    });
});
