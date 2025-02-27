import { GetVideosHandler } from '@videomatt/videos/videos/infrastructure/handlers/query/get-videos.handler';
import { VideoRead } from '@videomatt/videos/videos/domain/models/read/video.read';
import { DomainError } from '@videomatt/shared/domain/errors/domain.error';

export type QueryHandlerMapping = {
    GetVideosDTO: {
        handler: GetVideosHandler;
        error: DomainError;
        result: VideoRead[];
    };
};
