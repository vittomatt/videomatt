import { Response } from 'express';

import { DomainError } from '@videomatt/shared/domain/errors/domain.error';

export class HttpResponse {
    static domainError(res: Response, error: DomainError, statusCode: number): Response {
        return res.status(statusCode).json({
            error: error.toPrimitives(),
        });
    }

    static internalServerError(res: Response): Response {
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
}
