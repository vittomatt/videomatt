import pinoHttp, { HttpLogger } from 'pino-http';
import { injectable } from 'tsyringe';
import pino, { Logger } from 'pino';

import { Logger as LocalLogger } from '@videomatt/shared/domain/logger/logger';

@injectable()
export class PinoLogger implements LocalLogger {
    private readonly logger: Logger;
    private readonly httpLogger: HttpLogger;

    constructor() {
        const config = {
            level: 'info',
            options: {
                service: 'videomatt',
                env: 'development',
            },
        };
        const logger = pino(config);
        const httpLogger = pinoHttp({ logger });

        this.logger = logger;
        this.httpLogger = httpLogger;
    }

    public getInstance(): HttpLogger {
        return this.httpLogger;
    }

    public info(message: string): void {
        this.logger.info(message);
    }

    public error(message: string): void {
        this.logger.error(message);
    }
}
