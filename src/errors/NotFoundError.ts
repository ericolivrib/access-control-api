import { BaseHttpError } from "./BaseHttpError";

export class NotFoundError extends BaseHttpError {
  constructor(message: string) {
    super(message, 404);
  }
}
