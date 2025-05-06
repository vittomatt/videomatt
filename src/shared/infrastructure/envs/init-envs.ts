import { UnexpectedError } from '@shared/domain/errors/unexpected.error';

import dotenv from 'dotenv';
import { config as dotenvSafeConfig } from 'dotenv-safe';
import { z } from 'zod';

const nonEmptyStr = (name: string) => z.string().min(1, `${name} is required`);

export const envSchema = z.object({
    NODE_ENV: z.enum(['docker', 'dev', 'prod']).default('dev'),

    USERS_DB_POSTGRES_HOST: nonEmptyStr('USERS_DB_POSTGRES_HOST'),
    USERS_DB_POSTGRES_USER: nonEmptyStr('USERS_DB_POSTGRES_USER'),
    USERS_DB_POSTGRES_PASSWORD: nonEmptyStr('USERS_DB_POSTGRES_PASSWORD'),
    USERS_DB_POSTGRES_NAME: nonEmptyStr('USERS_DB_POSTGRES_NAME'),
    USERS_DB_POSTGRES_PORT: z.coerce.number().min(1),

    USERS_DB_REPLICA_POSTGRES_HOST: nonEmptyStr('USERS_DB_REPLICA_POSTGRES_HOST'),
    USERS_DB_REPLICA_POSTGRES_USER: nonEmptyStr('USERS_DB_REPLICA_POSTGRES_USER'),
    USERS_DB_REPLICA_POSTGRES_PASSWORD: nonEmptyStr('USERS_DB_REPLICA_POSTGRES_PASSWORD'),
    USERS_DB_REPLICA_POSTGRES_NAME: nonEmptyStr('USERS_DB_REPLICA_POSTGRES_NAME'),
    USERS_DB_REPLICA_POSTGRES_PORT: z.coerce.number().min(1),

    VIDEOS_DB_POSTGRES_HOST: nonEmptyStr('VIDEOS_DB_POSTGRES_HOST'),
    VIDEOS_DB_POSTGRES_USER: nonEmptyStr('VIDEOS_DB_POSTGRES_USER'),
    VIDEOS_DB_POSTGRES_PASSWORD: nonEmptyStr('VIDEOS_DB_POSTGRES_PASSWORD'),
    VIDEOS_DB_POSTGRES_NAME: nonEmptyStr('VIDEOS_DB_POSTGRES_NAME'),
    VIDEOS_DB_POSTGRES_PORT: z.coerce.number().min(1),

    VIDEOS_DB_REPLICA_POSTGRES_HOST: nonEmptyStr('VIDEOS_DB_REPLICA_POSTGRES_HOST'),
    VIDEOS_DB_REPLICA_POSTGRES_USER: nonEmptyStr('VIDEOS_DB_REPLICA_POSTGRES_USER'),
    VIDEOS_DB_REPLICA_POSTGRES_PASSWORD: nonEmptyStr('VIDEOS_DB_REPLICA_POSTGRES_PASSWORD'),
    VIDEOS_DB_REPLICA_POSTGRES_NAME: nonEmptyStr('VIDEOS_DB_REPLICA_POSTGRES_NAME'),
    VIDEOS_DB_REPLICA_POSTGRES_PORT: z.coerce.number().min(1),

    VIDEOS_COMMENT_DB_MONGO_HOST: nonEmptyStr('VIDEOS_COMMENT_DB_MONGO_HOST'),
    VIDEOS_COMMENT_DB_MONGO_USER: nonEmptyStr('VIDEOS_COMMENT_DB_MONGO_USER'),
    VIDEOS_COMMENT_DB_MONGO_PASSWORD: nonEmptyStr('VIDEOS_COMMENT_DB_MONGO_PASSWORD'),
    VIDEOS_COMMENT_DB_MONGO_PORT: z.coerce.number().min(1),
    VIDEOS_COMMENT_DB_MONGO_NAME: nonEmptyStr('VIDEOS_COMMENT_DB_MONGO_NAME'),

    REDIS_HOST: nonEmptyStr('REDIS_HOST'),
    REDIS_PORT: z.coerce.number().min(1),

    SNS_VIDEO_TOPIC_ARN: nonEmptyStr('SNS_VIDEO_TOPIC_ARN'),
    EVENT_BRIDGE_USER_TOPIC_ARN: nonEmptyStr('EVENT_BRIDGE_USER_TOPIC_ARN'),

    SQS_USER_CREATED_QUEUE_URL: nonEmptyStr('SQS_USER_CREATED_QUEUE_URL').url(),
    SQS_VIDEO_CREATED_QUEUE_URL: nonEmptyStr('SQS_VIDEO_CREATED_QUEUE_URL').url(),

    AWS_REGION: nonEmptyStr('AWS_REGION'),
    AWS_PROFILE: nonEmptyStr('AWS_PROFILE'),
    AWS_SNS_ENDPOINT: nonEmptyStr('AWS_SNS_ENDPOINT').url(),
    AWS_SQS_ENDPOINT: nonEmptyStr('AWS_SQS_ENDPOINT').url(),
    AWS_EVENT_BRIDGE_ENDPOINT: nonEmptyStr('AWS_EVENT_BRIDGE_ENDPOINT').url(),

    USERS_PORT: z.coerce.number().min(1).default(3000),
    VIDEOS_PORT: z.coerce.number().min(1).default(3001),
});

export type EnvVars = z.infer<typeof envSchema>;

let envConfig: EnvVars | null = null;

export function initEnvs() {
    const env = process.env.NODE_ENV ?? 'dev';
    const path = {
        docker: '.env.docker',
        dev: '.env',
        prod: '.env.prod',
    }[env];

    dotenv.config({ path, override: true });

    if (process.env.NODE_ENV !== 'prod') {
        dotenvSafeConfig({
            path,
            example: '.env.example',
            allowEmptyValues: false,
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
