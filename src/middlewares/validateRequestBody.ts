import { NextFunction, Request, Response } from "express";
import { ZodType, treeifyError } from "zod";

export default function validateRequestBody(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const { errors } = treeifyError(result.error);

      return res.status(400).json({ 
        message: 'Falha ao validar dados de requisição',
        errors
      });
    }

    next();
  }
}