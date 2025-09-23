import { NextFunction, Request, Response } from "express";
import { BaseHttpError } from "./BaseHttpError";
import { InternalServerError } from "./InternalServerError";

function normalizeError(err: unknown): BaseHttpError {
  if (err instanceof BaseHttpError) {
    return err;
  }

  return new InternalServerError(err);
}

export default function handleError(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) {
    return next(err);
  }

  const { statusCode, message } = normalizeError(err);

  res.status(statusCode).json({ message });
}