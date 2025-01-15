export interface VideoRepository<T> {
    add(item: T): Promise<void>;
    remove(item: T): Promise<void>;
    update(item: T): Promise<void>;
    search(): Promise<T[]>;
}
