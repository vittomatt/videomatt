import { HttpLogger } from 'pino-http';

export interface Logger {
    getInstance(): HttpLogger;
    info(message: string): void;
    error(message: string): void;
}
