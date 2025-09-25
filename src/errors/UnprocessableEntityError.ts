import { BaseHttpError } from "./BaseHttpError";

type FieldErrors = Record<string, string[]>;

export class UnprocessableEntityError extends BaseHttpError {
  fieldErrors: FieldErrors;

  constructor(message: string, errors?: FieldErrors) {
    super(message, 422);
    this.fieldErrors = errors || {};
  }

  body() {
    return {
      message: this.message,
      errors: this.fieldErrors
    };
  }
}