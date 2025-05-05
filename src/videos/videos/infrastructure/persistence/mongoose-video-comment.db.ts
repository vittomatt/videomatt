import { UnexpectedError } from '@shared/domain/errors/unexpected.error';
import { VideoCommentModel } from '@videos/video-comment/infrastructure/models/video-comment.db-model';

import mongoose, { Connection } from 'mongoose';

export class MongoVideosCommentDB {
    private connection!: Connection;
    private readonly uri: string;

    constructor({
        dbHost,
        dbUser,
        dbPassword,
        dbName,
        dbPort,
    }: {
        dbHost: string;
        dbUser: string;
        dbPassword: string;
        dbName: string;
        dbPort: number;
    }) {
        this.uri = `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?authSource=admin`;
    }

    public async connectDB() {
        try {
            const mongooseInstance = await mongoose.connect(this.uri);
            this.connection = mongooseInstance.connection;

            this.connection.on('connected', () => {
                console.log('✅ Connected to MongoDB');
            });

            this.connection.on('error', (err) => {
                console.error('❌ MongoDB connection error:', err);
            });
        } catch (error) {
            throw new UnexpectedError('MongoDB connection failed');
        }
    }

    public async closeDB() {
        if (!this.connection) {
            return;
        }
        await this.connection.close();
        console.log('🔌 MongoDB disconnected');
    }

    public getVideoCommentModel() {
        if (!VideoCommentModel) {
            throw new UnexpectedError('VideoCommentModel not initialized');
        }
        return VideoCommentModel;
    }
}
