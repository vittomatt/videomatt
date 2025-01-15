import { VideoRepository } from '@videomatt/videos/domain/repositories/video-repository';
import { Video } from '@videomatt/videos/domain/models/video';

export class DBVideoRepository implements VideoRepository<Video> {
    async add(video: Video): Promise<void> {
        throw new Error('Method not implemented.');
    }

    async remove(video: Video): Promise<void> {
        throw new Error('Method not implemented.');
    }

    async update(video: Video): Promise<void> {
        throw new Error('Method not implemented.');
    }

    async search(): Promise<Video[]> {
        throw new Error('Method not implemented.');
    }
}
