import { DomainError } from '@shared/domain/errors/domain.error';
import { ExpectedError } from '@shared/domain/errors/expected.error';
import { UnexpectedError } from '@shared/domain/errors/unexpected.error';
import { HttpResponse } from '@shared/infrastructure/controllers/http-response';

import { NextFunction, Request, Response } from 'express';
import { injectable } from 'tsyringe';

@injectable()
export class ErrorController {
    async execute(err: Error, req: Request, res: Response, next: NextFunction): Promise<void> {
        console.error(err.stack);

        if (err instanceof DomainError) {
            HttpResponse.domainError(res, err, 400);
            return;
        }

        if (err instanceof ExpectedError) {
            HttpResponse.domainError(res, err as DomainError, 422);
            return;
        }

        if (err instanceof UnexpectedError) {
            HttpResponse.internalServerError(res);
            return;
        }

        HttpResponse.internalServerError(res);
    }
}
