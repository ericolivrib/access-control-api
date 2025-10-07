import { ConflictError } from "@/errors/ConflictError";
import { NotFoundError } from "@/errors/NotFoundError";
import AccessModel from "@/models/accesses.model";
import PermissionModel from "@/models/permissions.model";
import UserModel from "@/models/users.model";
import { accessSchema, AccessSchema } from "@/schemas/access.schema";
import { GrantAccessSchema } from "@/schemas/grant-access.schema";
import { grantedAccessSchema, GrantedAccessSchema } from "@/schemas/granted-access.schema";
import { revokedAccessSchema, RevokedAccessSchema } from "@/schemas/revoked-access.schema";
import logger from "@/utils/logger";
import { IPage, paginate } from "@/utils/pagination";
import { JobCallback, scheduleJob } from "node-schedule";
import { UUID } from "node:crypto";
import { Op } from "sequelize";

interface IAccessService {
  grantAccess(userId: string, access: GrantAccessSchema): Promise<GrantedAccessSchema>;
  revokeAccess(accessId: string): Promise<RevokedAccessSchema>;
  getUserAccesses(userId: string, page: number, pageSize: number): Promise<IPage<AccessSchema>>;
  restoreAccessExpirations(): Promise<void>;
}

async function grantAccess(userId: UUID, access: GrantAccessSchema): Promise<GrantedAccessSchema> {
  const user = await UserModel.findByPk(userId);

  if (user === null) {
    logger.info({ userId }, 'Tentativa de concessão de acesso à usuário inexistente');
    throw new NotFoundError('Usuário não encontrado');
  }

  const grantedAccessesCount = await AccessModel.countGrantedByPermissionTypeAndUserId(userId, access.permissionType);

  if (grantedAccessesCount > 0) {
    logger.info({ userId, permissionType: access.permissionType }, 'Tentativa de concessão de acesso com permissão ainda em vigência para o usuário');
    throw new ConflictError('Usuário com acesso não expirado ou revogado');
  }

  const permission = await PermissionModel.findByType(access.permissionType);

  if (permission === null) {
    logger.info({ userId, permissionType: access.permissionType }, 'Tentativa de concessão de acesso com tipo de permissão inválido');
    throw new NotFoundError('Permissão não encontrada');
  }

  const newAccess = await AccessModel.create({
    userId,
    permissionId: permission.getDataValue('id'),
    grantedAt: new Date(),
    expiresAt: access.expiresAt,
  });

  scheduleAccessExpiration(newAccess.getDataValue('id'), access.expiresAt);  

  return grantedAccessSchema.parse({
    ...newAccess.dataValues,
    permission: { type: access.permissionType }
  });
}

async function scheduleAccessExpiration(accessId: string, expiresAt: Date) {
  logger.info({ accessId, expiresAt }, 'Agendando expiração do acesso para a data especificada');

  scheduleJob(expiresAt, async () => {
    const access = await AccessModel.findByPk(accessId, {
      attributes: ['id', 'userId', 'status']
    });

    if (access === null) {
      logger.warn({ accessId }, 'Tentativa de expiração de acesso não encontrado');
      return
    }

    const currentStatus = access.getDataValue('status');

    if (currentStatus !== 'granted') {
      return
    }

    await access.update(
      {
        status: 'expired',
        expiresAt: new Date()
      }
    );

    logger.info({ accessId, userId: access.getDataValue('userId') }, 'Acesso expirado para o usuário');
  });
}

async function restoreAccessExpirations() {
  logger.info('Reagendando expiração de acessos');
  const pendingAccesses = await AccessModel.findAll({
    where: {
      status: 'granted',
      expiresAt: {
        [Op.gt]: new Date()
      }
    }
  });

  for (const access of pendingAccesses) {
    const expiresAt = access.getDataValue('expiresAt');
    const accessId = access.getDataValue('id');

    await scheduleAccessExpiration(accessId, expiresAt);
  }
}

async function revokeAccess(accessId: string): Promise<RevokedAccessSchema> {
  const access = await AccessModel.findByPk(accessId, {
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

  const permission = await PermissionModel.findByPk(access.getDataValue('permissionId'), {
    attributes: ['type']
  })

  return revokedAccessSchema.parse({
    ...access.dataValues,
    permission: permission?.dataValues
  });
}

async function getUserAccesses(userId: string, page: number, pageSize: number): Promise<IPage<AccessSchema>> {
  const userCount = await UserModel.count({
    where: {
      id: userId
    }
  });

  if (userCount == 0) {
    logger.info({ userId }, 'Tentativa de busca de acessos de um usuário não encontrado');
    throw new NotFoundError('Usuário não encontrado para a recuperação de acessos');
  }

  const offset = (page - 1) * pageSize;

  const { count, rows } = await AccessModel.findAndCountAll({
    where: { userId },
    limit: pageSize,
    offset,
    order: [['grantedAt', 'ASC']],
    include: [{
      model: PermissionModel,
      as: 'permission'
    }]
  });

  const accesses = accessSchema.array().parse(rows);
  return paginate(accesses, page, pageSize, count);
}

export const accessService: IAccessService = {
  grantAccess,
  revokeAccess,
  getUserAccesses,
  restoreAccessExpirations
}