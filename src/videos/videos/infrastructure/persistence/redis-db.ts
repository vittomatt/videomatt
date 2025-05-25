import { getEnvs } from '@videos/videos.envs';

import { RedisClientType, createClient } from 'redis';

export class RedisDB {
    private readonly client: RedisClientType;

    constructor() {
        const envs = getEnvs();
        const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = envs;

        this.client = createClient({
            url: `redis://:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`,
        });

        this.client.on('error', (err) => console.error('Redis Client Error', err));
    }

    public async connect() {
        try {
            await this.client.connect();
            console.log('✅ Connected to Redis successfully');
        } catch (error) {
            console.error('❌ Error connecting to Redis:', error);
            throw error;
        }
    }

    public async getValue(key: string): Promise<string | null> {
        try {
            const value = await this.client.get(key);
            return value;
        } catch (error) {
            console.error('❌ Error getting value from Redis:', error);
            throw error;
        }
    }

    public async setValue(key: string, value: string) {
        try {
            await this.client.set(key, value);
            console.log(`✅ Key ${key} set successfully`);
        } catch (error) {
            console.error('❌ Error setting value in Redis:', error);
            throw error;
        }
    }

    public async deleteValue(key: string) {
        try {
            await this.client.del(key);
            console.log(`✅ Key ${key} deleted successfully`);
        } catch (error) {
            console.error('❌ Error deleting value in Redis:', error);
        }
    }

    public async disconnect() {
        try {
            await this.client.disconnect();
            console.log('✅ Disconnected from Redis successfully');
        } catch (error) {
            console.error('❌ Error disconnecting from Redis:', error);
            throw error;
        }
    }
}
