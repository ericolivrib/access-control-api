import { BaseHttpError } from "./BaseHttpError";

export class LockedError extends BaseHttpError {
  constructor(message: string) {
    super(message, 423);
  }
}