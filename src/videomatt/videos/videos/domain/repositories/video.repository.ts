import { Repository } from '@videomatt/shared/infrastructure/repositories/repository';

export type VideoRepository<T> = Repository<T> & {
    check(id: string): Promise<boolean>;
    save(id: string): Promise<void>;
};
