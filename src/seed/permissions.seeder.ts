import PermissionModel, { PermissionType } from "@/models/permissions.model";
import logger from "@/utils/logger";

export async function seedPermission() {
  logger.info("Configurando permissões padrão...");

  const permissions = [
    {
      type: 'revoke_access' as PermissionType,
      description: 'Permite revogar permissões de usuários'
    },
    {
      type: 'grant_access' as PermissionType,
      description: 'Permite conceder permissões a outros usuários'
    },
    {
      type: 'update_access_expiration' as PermissionType,
      description: 'Atualiza o tempo de expiração de permissões dos usuários'
    },
    {
      type: 'create_user' as PermissionType,
      description: 'Permite criar novos usuários'
    },
    {
      type: 'update_user' as PermissionType,
      description: 'Permite atualizar os dados de usuários existentes'
    },
    {
      type: 'get_users' as PermissionType,
      description: 'Permite recuperar os usuários existentes'
    },
    {
      type: 'change_user_activation' as PermissionType,
      description: 'Pode ativar/desativar usuários existentes'
    },
    {
      type: 'get_user_accesses' as PermissionType,
      description: 'Pode visualizar todos os acessos de um determinado usuário'
    },
  ];

  for (const res of permissions) {
    await PermissionModel.findOrCreate({
      where: { type: res.type },
      defaults: res,
    });
  }
}