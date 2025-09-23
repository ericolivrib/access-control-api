import { NextFunction, Request, Response } from "express";

export default function captureError(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res)).catch(next);
  }
}