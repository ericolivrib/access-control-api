import { UnauthorizedError } from "@/errors/UnauthorizedError";
import { environment } from "@/schemas/env.schema";
import { authService } from "@/services/auth.service";
import logger from "@/utils/logger";
import { NextFunction, Request, Response } from "express";

import jwt, { JwtPayload } from "jsonwebtoken";

export default async function verifyJwt(req: Request, res: Response, next: NextFunction) {
  const token = extractToken(req);

  if (token == null) {
    logger.info("Token de acesso não fornecido");
    throw new UnauthorizedError("Token de acesso não fornecido");
  }

  let userId: string | undefined;
  const secret = environment.JWT_SECRET;

  jwt.verify(token, secret, (err, payload) => {
    if (err) {
      logger.error(err, "Falha ao verificar o token JWT");
      throw new UnauthorizedError('Token de acesso inválido ou expirado');
    }

    userId = (<JwtPayload>payload).sub;
  });

  try {
    const user = await authService.getUserById(userId!);
    req['user'] = user;
  } catch (error) {
    logger.info({ userId }, "Usuário não encontrado para o token de acesso fornecido");
    throw new UnauthorizedError("Não autorizado");
  }

  next();
}

function extractToken(req: Request): string | null {
  const token = req.headers['authorization'];

  if (!token || !token.startsWith('Bearer')) {
    return null;
  }
  return token.split(' ')[1];
}