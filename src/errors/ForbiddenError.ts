import { BaseHttpError } from "./BaseHttpError";

export class ForbiddenError extends BaseHttpError {
  readonly requiredPermission: string;
  
  constructor(message: string, requiredPermission: string) {
    super(message, 403);
    this.requiredPermission = requiredPermission;
  }

  body() {
    return {
      message: this.message,
      requiredPermission: this.requiredPermission
    }
  }
}