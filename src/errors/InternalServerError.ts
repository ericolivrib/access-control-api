import { BaseHttpError } from "./BaseHttpError";

export class InternalServerError extends BaseHttpError {
  constructor(err: unknown) {
    console.error(err);
    super('Erro interno do servidor', 500);
  }
}