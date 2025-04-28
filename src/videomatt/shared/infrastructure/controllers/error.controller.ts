import { NextFunction, Request, Response } from 'express';
import { injectable } from 'tsyringe';

import { HttpResponse } from '@videomatt/shared/infrastructure/controllers/http-response';

@injectable()
export class ErrorController {
    async execute(err: Error, req: Request, res: Response, next: NextFunction): Promise<void> {
        console.error(err.stack);
        HttpResponse.internalServerError(res);
    }
}
