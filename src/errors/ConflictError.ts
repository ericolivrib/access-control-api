import { BaseHttpError } from "./BaseHttpError";

export class ConflictError extends BaseHttpError {
  constructor(message: string) {
    super(message, 409);
  }
}