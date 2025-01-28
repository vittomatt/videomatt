import { ParamsDictionary } from 'express-serve-static-core';
import { NextFunction, Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export const validateDto = (DtoClass: new () => object, from: 'body' | 'params' = 'body') => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const dataToValidate = from === 'body' ? req.body : req.params;
        const dtoInstance = plainToInstance(DtoClass, dataToValidate);
        const errors = await validate(dtoInstance);

        if (errors.length > 0) {
            res.status(400).json({
                message: 'Validation failed',
                errors: errors.map((err) => ({
                    property: err.property,
                    constraints: err.constraints,
                })),
            });
            return;
        }

        if (from === 'body') {
            req.body = dtoInstance;
        } else {
            req.params = dtoInstance as unknown as ParamsDictionary;
        }

        next();
    };
};
