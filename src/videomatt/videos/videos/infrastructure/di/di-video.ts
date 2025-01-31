import { SQSEventVideoPublishedConsumer } from '@videomatt/users/infrastructure/broker/consumers/sqs-event-video-published.consumer';
import { PublishVideoController } from '@videomatt/videos/videos/infrastructure/controllers/publish-video/publish-video.controller';
import { GetVideosController } from '@videomatt/videos/videos/infrastructure/controllers/get-videos/get-videos.controller';
import { SNSVideoEventPublisher } from '@videomatt/videos/videos/infrastructure/broker/sns-video-event.publisher';
import { DBVideoRepository } from '@videomatt/videos/videos/infrastructure/repositories/db-video.repository';
import { PublishVideoUseCase } from '@videomatt/videos/videos/application/publish-video.use-case';
import { GetVideosUseCase } from '@videomatt/videos/videos/application/get-videos.use-case';
import { DBModel } from '@videomatt/shared/infrastructure/persistence/db';
import { getEnvs } from '@videomatt/shared/envs/init-envs';
import { TOKEN } from './tokens-video';
import { container } from 'tsyringe';

export class DIVideos {
    constructor(private readonly db: DBModel) {}

    public initDi() {
        this.initDBDependencies();
        this.initControllersDependencies();
        this.initUseCasesDependencies();
        this.initBrokerDependencies();
        this.initRepositoriesDependencies();
    }

    private initDBDependencies() {
        container.register(TOKEN.DB_MODEL, {
            useValue: this.db.getVideoModel(),
        });
    }

    private initControllersDependencies() {
        container.register(TOKEN.PUBLISH_VIDEO_CONTROLLER, {
            useClass: PublishVideoController,
        });
        container.register(TOKEN.GET_VIDEOS_CONTROLLER, {
            useClass: GetVideosController,
        });
    }

    private initUseCasesDependencies() {
        container.register(TOKEN.PUBLISH_VIDEO_USE_CASE, {
            useClass: PublishVideoUseCase,
        });
        container.register(TOKEN.GET_VIDEOS_USE_CASE, {
            useClass: GetVideosUseCase,
        });
    }

    private initBrokerDependencies() {
        container.register(TOKEN.SNS_TOPIC_ARN, {
            useValue: getEnvs().SNS_VIDEO_TOPIC_ARN,
        });
        container.register(TOKEN.SNS_EVENT_PUBLISHER, {
            useClass: SNSVideoEventPublisher,
        });
        container.register(TOKEN.SQS_VIDEO_PUBLISHED_QUEUE_URL, {
            useValue: getEnvs().SQS_VIDEO_PUBLISHED_QUEUE_URL,
        });
        container.register(TOKEN.SQS_EVENT_PUBLISHED_CONSUMER, {
            useClass: SQSEventVideoPublishedConsumer,
        });
    }

    private initRepositoriesDependencies() {
        container.register(TOKEN.REPOSITORY, {
            useClass: DBVideoRepository,
        });
    }
}
