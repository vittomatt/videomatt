import { Criteria } from '../../../../videomatt/shared/domain/repositories/criteria';

import { User } from '@videomatt/users/domain/models/write/user';
import { UserId } from '@videomatt/users/domain/models/write/user-id';
import { UserRepository } from '@videomatt/users/domain/repositories/user.repository';

export class MockUserRepository implements UserRepository<User> {
    private readonly mockSave = jest.fn();
    private readonly mockRemove = jest.fn();
    private readonly mockUpdate = jest.fn();
    private readonly mockSearch = jest.fn();
    private readonly mockSearchById = jest.fn();

    add(item: User): Promise<void> {
        expect(this.mockSave).toHaveBeenCalledWith(item.toPrimitives());
        return Promise.resolve();
    }

    remove(item: User): Promise<void> {
        expect(this.mockRemove).toHaveBeenCalledWith(item.toPrimitives());
        return Promise.resolve();
    }

    update(item: User): Promise<void> {
        expect(this.mockUpdate).toHaveBeenCalledWith(item.toPrimitives());
        return Promise.resolve();
    }

    search(criteria: Criteria): Promise<User[]> {
        expect(this.mockSearch).toHaveBeenCalledWith(criteria);
        return this.mockSearch() as Promise<User[]>;
    }

    searchById(id: string): Promise<User | null> {
        expect(this.mockSearchById).toHaveBeenCalledWith(id);
        return this.mockSearchById() as Promise<User | null>;
    }

    shouldSave(user: User): void {
        this.mockSave(user.toPrimitives());
    }

    shouldRemove(user: User): void {
        this.mockRemove(user.toPrimitives());
    }

    shouldUpdate(user: User): void {
        this.mockUpdate(user.toPrimitives());
    }

    shouldSearch(user: User): void {
        this.mockSearch(user.id);
        this.mockSearch.mockReturnValueOnce(user);
    }

    shouldNotSearch(id: UserId): void {
        this.mockSearch(id);
        this.mockSearch.mockReturnValueOnce(null);
    }
}
