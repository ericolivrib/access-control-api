export class BaseHttpError extends Error {
  public statusCode: number;
  public details?: any;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }

  body() {
    return { message: this.message };
  }
}