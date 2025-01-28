import { config as dotenvSafeConfig } from 'dotenv-safe';
import dotenv from 'dotenv';
import { z } from 'zod';

const envSchema = z.object({
    NODE_ENV: z.string(),
    DB_HOST: z.string(),
    POSTGRES_USER: z.string(),
    POSTGRES_PASSWORD: z.string(),
    POSTGRES_DB: z.string(),
    SNS_VIDEO_TOPIC_ARN: z.string(),
    SNS_USER_TOPIC_ARN: z.string(),
    SQS_USER_QUEUE_URL: z.string(),
    SQS_VIDEO_QUEUE_URL: z.string(),
    AWS_REGION: z.string(),
    PORT: z.coerce.number().default(3000),
});

export type EnvVars = z.infer<typeof envSchema>;

let envConfig: EnvVars | null = null;

export function initEnvs() {
    if (process.env.NODE_ENV !== 'production') {
        dotenvSafeConfig({
            path: '.env',
            example: '.env.example',
            allowEmptyValues: false,
        });
    }

    dotenv.config({ path: './config/.env' });

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
