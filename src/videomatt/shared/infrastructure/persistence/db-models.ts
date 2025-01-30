import { DBVideoComment } from '@videomatt/videos/video-comment/infrastructure/models/db-video-comment.model';
import { DBVideo } from '@videomatt/videos/videos/infrastructure/models/db-video.model';
import { DBUser } from '@videomatt/users/infrastructure/models/db-user.model';

export interface DBModels {
    DBUser?: typeof DBUser;
    DBVideo?: typeof DBVideo;
    DBVideoComment?: typeof DBVideoComment;
}
