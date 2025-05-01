import dotenv from 'dotenv';
import { config as dotenvSafeConfig } from 'dotenv-safe';
import { z } from 'zod';

const envSchema = z.object({
    NODE_ENV: z.enum(['docker', 'dev', 'prod']).default('dev'),

    USERS_DB_HOST: z.string(),
    USERS_POSTGRES_USER: z.string(),
    USERS_POSTGRES_PASSWORD: z.string(),
    USERS_POSTGRES_NAME: z.string(),
    USERS_POSTGRES_PORT: z.coerce.number(),

    VIDEOS_DB_HOST: z.string(),
    VIDEOS_POSTGRES_USER: z.string(),
    VIDEOS_POSTGRES_PASSWORD: z.string(),
    VIDEOS_POSTGRES_NAME: z.string(),
    VIDEOS_POSTGRES_PORT: z.coerce.number(),

    REDIS_HOST: z.string(),
    REDIS_PORT: z.coerce.number(),

    SNS_VIDEO_TOPIC_ARN: z.string(),
    SNS_USER_TOPIC_ARN: z.string(),

    SQS_USER_CREATED_QUEUE_URL: z.string(),
    SQS_VIDEO_CREATED_QUEUE_URL: z.string(),

    AWS_REGION: z.string(),
    AWS_PROFILE: z.string(),
    AWS_ENDPOINT: z.string(),

    USERS_PORT: z.coerce.number().default(3000),
    VIDEOS_PORT: z.coerce.number().default(3001),
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
        throw new Error('Invalid environment variables');
    }

    envConfig = parsed.data;
    return envConfig;
}

export function getEnvs(): EnvVars {
    if (!envConfig) {
        throw new Error('You must call initEnvs() before getEnvs()');
    }
    return envConfig;
}
