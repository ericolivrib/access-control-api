import Permission, { PermissionType } from "@/models/permissions.model";
import logger from "@/utils/logger";

export async function seedPermission() {
  logger.info("Configurando permissões padrão...");

  const permissions = [
    {
      type: PermissionType.REVOKE_ACCESS,
      description: 'Permite revogar permissões de usuários'
    },
    {
      type: PermissionType.GRANT_ACCESS,
      description: 'Permite conceder permissões a outros usuários'
    },
    {
      type: PermissionType.UPDATE_ACCESS_EXPIRATION,
      description: 'Atualiza o tempo de expiração de permissões dos usuários'
    },
    {
      type: PermissionType.CREATE_USER,
      description: 'Permite criar novos usuários'
    },
    {
      type: PermissionType.UPDATE_USER,
      description: 'Permite atualizar os dados de usuários existentes'
    },
    {
      type: PermissionType.GET_USERS,
      description: 'Permite recuperar os usuários existentes'
    },
    {
      type: PermissionType.CHANGE_USER_ACTIVATION,
      description: 'Pode ativar/desativar usuários existentes'
    },
  ];

  for (const res of permissions) {
    await Permission.findOrCreate({
      where: { type: res.type },
      defaults: res,
    });
  }
}