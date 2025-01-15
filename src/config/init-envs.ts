import path from 'path';
import { z } from 'zod';
import { config as dotenvSafeConfig } from 'dotenv-safe';
import dotenv from 'dotenv';

const envSchema = z.object({
    DB_HOST: z.string(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_NAME: z.string(),
    PORT: z.coerce.number().default(3000),
});

export type EnvVars = z.infer<typeof envSchema>;

let envConfig: EnvVars | null = null;

export function initEnvs() {
    if (process.env.NODE_ENV !== 'production') {
        dotenvSafeConfig({
            path: path.join(__dirname, '.env'),
            example: path.join(__dirname, '.env.example'),
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
