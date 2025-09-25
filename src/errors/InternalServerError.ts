import logger from "@/utils/logger";
import { BaseHttpError } from "./BaseHttpError";

export class InternalServerError extends BaseHttpError {
  constructor(err: unknown) {
    logger.error(err, 'Um erro inesperado ocorreu');
    super('Erro interno do servidor', 500);
  }
}