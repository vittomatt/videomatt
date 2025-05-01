import { DomainError } from '@shared/domain/errors/domain.error';

import { Response } from 'express';

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
