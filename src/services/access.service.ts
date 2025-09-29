import { ConflictError } from "@/errors/ConflictError";
import { NotFoundError } from "@/errors/NotFoundError";
import Access from "@/models/accesses.model";
import Permission from "@/models/permissions.model";
import User from "@/models/users.model";
import { accessSchema, AccessSchema } from "@/schemas/access.schema";
import { GrantAccessSchema } from "@/schemas/grant-access.schema";
import logger from "@/utils/logger";
import { UUID } from "node:crypto";

interface IAccessService {
  grantAccess(userId: string, access: GrantAccessSchema): Promise<AccessSchema>;
}

async function grantAccess(userId: UUID, access: GrantAccessSchema): Promise<AccessSchema> {
  const user = await User.findByPk(userId);

  if (user === null) {
    logger.info({ userId }, 'Tentativa de concessão de acesso à usuário inexistente');
    throw new NotFoundError('Usuário não encontrado');
  }

  const grantedAccessesCount = await Access.countGrantedByPermissionTypeAndUserId(userId, access.permissionType);

  if (grantedAccessesCount > 0) {
    logger.info({ userId, permissionType: access.permissionType }, 'Tentativa de concessão de acesso com permissão ainda em vigência para o usuário');
    throw new ConflictError('Usuário com acesso não expirado ou revogado');
  }

  const permission = await Permission.findByType(access.permissionType);

  if (permission === null) {
    logger.info({ userId, permissionType: access.permissionType  }, 'Tentativa de concessão de acesso com tipo de permissão inválido');
    throw new NotFoundError('Permissão não encontrada');
  }

  const newAccess = await Access.create({
    userId,
    permissionId: permission.getDataValue('id'),
    grantedAt: new Date(),
    expiresAt: access.expiresAt,
  });

  return accessSchema.parse({
    ...newAccess.dataValues,
    permissionType: access.permissionType
  });
}


export const accessService: IAccessService = {
  grantAccess
}