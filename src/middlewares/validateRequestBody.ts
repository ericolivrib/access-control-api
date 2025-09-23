import { NextFunction, Request, Response } from "express";
import { ZodType, flattenError, treeifyError } from "zod";

export default function validateRequestBody(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const { fieldErrors } = flattenError(result.error);

      return res.status(422).json({ 
        message: 'Falha ao validar dados de requisição',
        errors: fieldErrors
      });
    }

    next();
  }
}