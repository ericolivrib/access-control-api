import { UnprocessableEntityError } from "@/errors/UnprocessableEntityError";
import { NextFunction, Request, Response } from "express";
import { ZodType, flattenError } from "zod";

export default function validateRequestBody(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const { fieldErrors } = flattenError(result.error);
      throw new UnprocessableEntityError('Falha ao validar dados de requisição', fieldErrors);
    }

    next();
  }
}