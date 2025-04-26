import { GetVideosUseCase } from '@videomatt/videos/videos/application/get-videos/get-videos.use-case';
import { VIDEO_TOKEN } from '@videomatt/videos/videos/infrastructure/di/tokens-video';
import { VideoRead } from '@videomatt/videos/videos/domain/models/read/video.read';
import { GetVideosDTO } from '@videomatt/videos/videos/domain/dtos/get-videos.dto';
import { QueryHandler } from '@videomatt/shared/domain/event-bus/query.handler';
import { DomainError } from '@videomatt/shared/domain/errors/domain.error';
import { DTO } from '@videomatt/shared/domain/dtos/dto';
import { inject, injectable } from 'tsyringe';

@injectable()
export class GetVideosHandler implements QueryHandler<DomainError, VideoRead[]> {
    constructor(
        @inject(VIDEO_TOKEN.GET_VIDEOS_USE_CASE)
        private readonly useCase: GetVideosUseCase
    ) {}

    handle(dto: DTO): Promise<VideoRead[]> {
        const videoEvent = dto as GetVideosDTO;
        return this.useCase.execute(videoEvent.userId);
    }
}
