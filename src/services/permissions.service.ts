import { InternalServerError } from "@/errors/InternalServerError";
import PermissionModel from "@/models/permissions.model";
import { permissionSchema, PermissionSchema } from "@/schemas/permission.schema";
import logger from "@/utils/logger";

interface IPermissionsService {
  getPermissions(): Promise<PermissionSchema[]>;
}

async function getPermissions(): Promise<PermissionSchema[]> {
  const permissions = await PermissionModel.findAll();

  if (permissions.length === 0) {
    logger.error('Falha ao buscar permissões na base de dados.');
    throw new InternalServerError('Nenhuma permissão encontrada na base de dados.');
  }

  return permissionSchema.array().parse(permissions);
}

export const permissionsService: IPermissionsService = {
  getPermissions
};