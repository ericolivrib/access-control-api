import { LockedError } from "@/errors/LockedError";
import { UnauthorizedError } from "@/errors/UnauthorizedError";
import { environment } from "@/schemas/env.schema";
import { UserWithAccesses } from "@/schemas/user-with-accesses";
import { authService } from "@/services/auth.service";
import logger from "@/utils/logger";
import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";

function throwJwtError(err: jwt.VerifyErrors) {
  if (err instanceof jwt.TokenExpiredError) {
    logger.info({ expiredAt: err.expiredAt }, "Tentativa de acesso com token expirado");
    throw new UnauthorizedError('Token de acesso expirado');
  }

  if (err instanceof jwt.JsonWebTokenError) {
    logger.info("Tentativa de acesso com token inválido");
    throw new UnauthorizedError('Token de acesso inválido');
  }
}

function extractToken(req: Request): string | null {
  const token = req.headers['authorization'];

  if (!token || !token.startsWith('Bearer')) {
    return null;
  }
  return token.split(' ')[1];
}

export default async function verifyJwt(req: Request, res: Response, next: NextFunction) {
  const token = extractToken(req);

  if (token == null) {
    logger.info("Tentativa de acesso sem token no cabeçalho de autorização");
    throw new UnauthorizedError("Token de acesso não fornecido");
  }

  let userId: string | undefined;
  const secret = environment.JWT_SECRET;

  jwt.verify(token, secret, (err, payload) => {
    if (err) throwJwtError(err);
    userId = (<jwt.JwtPayload>payload).sub;
  });

  let user: UserWithAccesses

  try {
    user = await authService.getUserById(userId!);
  } catch (error) {
    logger.info({ userId }, "Usuário não encontrado para o token de acesso fornecido");
    throw new UnauthorizedError("Não autorizado");
  }

  if (!user.active) {
    logger.info({ userId }, 'Tentativa de acesso com conta inativa');
    throw new LockedError('É necessário estar com a conta ativa para acessar os recursos do sistema');
  }

  req['user'] = user;
  next();
}
