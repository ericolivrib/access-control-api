import { BaseHttpError } from "./BaseHttpError";

export class UnauthorizedError extends BaseHttpError {
  constructor(message: string) {
    super(message, 401);
  }
}