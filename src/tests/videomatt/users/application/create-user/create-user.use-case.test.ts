import 'reflect-metadata';

import { expect } from 'chai';
import sinon from 'sinon';

import { CreateUserUseCase } from '@videomatt/users/application/create-user/create-user.use-case';
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

    it('should workd', async () => {
        // expect(true).to.be.true;
    });
});
