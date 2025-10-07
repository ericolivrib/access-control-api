import { ForbiddenError } from "@/errors/ForbiddenError";
import { PermissionType } from "@/models/permission.model";
import { UserWithAccesses } from "@/schemas/user-with-accesses";
import logger from "@/utils/logger";
import { NextFunction, Request, Response } from "express";

export default function verifyPermission(permission: PermissionType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user: UserWithAccesses = req['user'];

    if (user.role === 'admin') {
      return next()
    }

    const hasPermission = user.accesses.some(
      (access) =>
        access.permission.type === permission &&
        access.expiresAt < new Date()
    );

    if (!hasPermission) {
      logger.info({}, 'Tentativa de accesso de usuário sem permissões requeridas.');
      throw new ForbiddenError('Acesso negado', permission);
    }

    next();
  }
}