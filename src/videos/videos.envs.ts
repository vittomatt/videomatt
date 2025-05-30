import { UnexpectedError } from '@shared/domain/errors/unexpected.error';

import dotenv from 'dotenv';
import { config as dotenvSafeConfig } from 'dotenv-safe';
import { z } from 'zod';

function nonEmptyStr(name: string) {
    return z.string().min(1, `${name} is required`);
}

let envConfig: EnvVars | null = null;

export const envSchema = z.object({
    NODE_ENV: z.enum(['docker', 'dev', 'prod']).default('dev'),

    VIDEOS_PORT: z.coerce.number().min(1),

    VIDEOS_POSTGRES_DB_HOST: nonEmptyStr('VIDEOS_POSTGRES_DB_HOST'),
    VIDEOS_POSTGRES_DB_USER: nonEmptyStr('VIDEOS_POSTGRES_DB_USER'),
    VIDEOS_POSTGRES_DB_PASSWORD: nonEmptyStr('VIDEOS_POSTGRES_DB_PASSWORD'),
    VIDEOS_POSTGRES_DB_NAME: nonEmptyStr('VIDEOS_POSTGRES_DB_NAME'),
    VIDEOS_POSTGRES_DB_PORT: z.coerce.number().min(1),

    VIDEOS_POSTGRES_DB_REPLICA_HOST: nonEmptyStr('VIDEOS_POSTGRES_DB_REPLICA_HOST'),

    VIDEOS_COMMENT_MONGO_DB_HOST: nonEmptyStr('VIDEOS_COMMENT_MONGO_DB_HOST'),
    VIDEOS_COMMENT_MONGO_DB_NAME: nonEmptyStr('VIDEOS_COMMENT_MONGO_DB_NAME'),
    VIDEOS_COMMENT_MONGO_DB_PORT: z.coerce.number().min(1),
    VIDEOS_COMMENT_MONGO_DB_USER: nonEmptyStr('VIDEOS_COMMENT_MONGO_DB_USER'),
    VIDEOS_COMMENT_MONGO_DB_PASSWORD: nonEmptyStr('VIDEOS_COMMENT_MONGO_DB_PASSWORD'),

    REDIS_HOST: nonEmptyStr('REDIS_HOST'),
    REDIS_PORT: z.coerce.number().min(1),
    REDIS_PASSWORD: nonEmptyStr('REDIS_PASSWORD'),

    AWS_REGION: nonEmptyStr('AWS_REGION'),
    AWS_PROFILE: z.string().optional(),
    AWS_ACCESS_KEY_ID: z.string().optional(),
    AWS_SECRET_ACCESS_KEY: z.string().optional(),

    AWS_SNS_ENDPOINT: nonEmptyStr('AWS_SNS_ENDPOINT').url(),
    AWS_SQS_ENDPOINT: nonEmptyStr('AWS_SQS_ENDPOINT').url(),
    AWS_EVENT_BRIDGE_ENDPOINT: nonEmptyStr('AWS_EVENT_BRIDGE_ENDPOINT').url(),

    SQS_USER_CREATED_QUEUE_URL: nonEmptyStr('SQS_USER_CREATED_QUEUE_URL').url(),
    SQS_VIDEO_CREATED_QUEUE_URL: nonEmptyStr('SQS_VIDEO_CREATED_QUEUE_URL').url(),

    SNS_VIDEO_TOPIC_ARN: nonEmptyStr('SNS_VIDEO_TOPIC_ARN'),
    EVENT_BRIDGE_USER_TOPIC_ARN: nonEmptyStr('EVENT_BRIDGE_USER_TOPIC_ARN'),
});

export type EnvVars = z.infer<typeof envSchema>;

export function initEnvs() {
    const env = process.env.NODE_ENV ?? 'dev';
    const path = {
        dev: '.env',
        prod: '.env.prod',
    }[env];

    dotenv.config({ path });

    if (process.env.NODE_ENV !== 'prod') {
        dotenvSafeConfig({
            path,
            example: '.env.example',
            allowEmptyValues: true,
        });
    }

    const parsed = envSchema.safeParse(process.env);
    if (!parsed.success) {
        console.error('❌ Invalid environment variables:', parsed.error.format());
        throw new UnexpectedError('Invalid environment variables');
    }

    envConfig = parsed.data;
    return envConfig;
}

export function getEnvs(): EnvVars {
    if (!envConfig) {
        throw new UnexpectedError('You must call initEnvs() before getEnvs()');
    }
    return envConfig;
}
