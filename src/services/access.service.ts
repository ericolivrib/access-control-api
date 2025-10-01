import { ConflictError } from "@/errors/ConflictError";
import { NotFoundError } from "@/errors/NotFoundError";
import Access from "@/models/accesses.model";
import Permission from "@/models/permissions.model";
import User from "@/models/users.model";
import { accessSchema, AccessSchema } from "@/schemas/access.schema";
import { GrantAccessSchema } from "@/schemas/grant-access.schema";
import { grantedAccessSchema, GrantedAccessSchema } from "@/schemas/granted-access.schema";
import { revokedAccessSchema, RevokedAccessSchema } from "@/schemas/revoked-access.schema";
import logger from "@/utils/logger";
import { IPage, paginate } from "@/utils/pagination";
import { UUID } from "node:crypto";

interface IAccessService {
  grantAccess(userId: string, access: GrantAccessSchema): Promise<GrantedAccessSchema>;
  revokeAccess(accessId: string): Promise<RevokedAccessSchema>;
  getUserAccesses(userId: string, page: number, pageSize: number): Promise<IPage<AccessSchema>>;
}

async function grantAccess(userId: UUID, access: GrantAccessSchema): Promise<GrantedAccessSchema> {
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
    logger.info({ userId, permissionType: access.permissionType }, 'Tentativa de concessão de acesso com tipo de permissão inválido');
    throw new NotFoundError('Permissão não encontrada');
  }

  const newAccess = await Access.create({
    userId,
    permissionId: permission.getDataValue('id'),
    grantedAt: new Date(),
    expiresAt: access.expiresAt,
  });

  return grantedAccessSchema.parse({
    ...newAccess.dataValues,
    permission: { type: access.permissionType }
  });
}

async function revokeAccess(accessId: string): Promise<RevokedAccessSchema> {
  const access = await Access.findByPk(accessId, {
    attributes: ['id', 'userId', 'permissionId', 'status', 'grantedAt']
  });

  if (access === null) {
    logger.info({ accessId }, 'Tentativa de revogação de acesso não encontrado');
    throw new NotFoundError('Acesso não encontrado para revogação');
  }

  const currentStatus = access.getDataValue('status');

  if (currentStatus !== 'granted') {
    logger.info({ accessId }, 'Tentativa de revogação de acesso expirado ou préviamente revogado');
    throw new ConflictError('Não é possível revogar um acesso já expirado ou revogado');
  }

  await access.update({
    status: 'revoked',
    revokedAt: new Date()
  });

  const permission = await Permission.findByPk(access.getDataValue('permissionId'), {
    attributes: ['type']
  })

  return revokedAccessSchema.parse({
    ...access.dataValues,
    permission: permission?.dataValues
  });
}

async function getUserAccesses(userId: string, page: number, pageSize: number): Promise<IPage<AccessSchema>> {
  const userCount = await User.count({
    where: {
      id: userId
    }
  });

  if (userCount == 0) {
    logger.info({ userId }, 'Tentativa de busca de acessos de um usuário não encontrado');
    throw new NotFoundError('Usuário não encontrado para a recuperação de acessos');
  }

  const offset = (page - 1) * pageSize;

  const { count, rows } = await Access.findAndCountAll({
    where: { userId },
    limit: pageSize,
    offset,
    order: [['grantedAt', 'ASC']],
    include: [{
      model: Permission,
      as: 'permission'
    }]
  });

  const accesses = accessSchema.array().parse(rows);
  return paginate(accesses, page, pageSize, count);
}

export const accessService: IAccessService = {
  grantAccess,
  revokeAccess,
  getUserAccesses
}