import Resource, { ResourceType } from "@/models/resources.model";
import logger from "@/utils/logger";

export async function seedResources() {
  logger.info("Configurando recursos padrão...");

  const resources = [
    {
      type: ResourceType.REVOKE_ACCESS,
      description: 'Permite revogar permissões de usuários'
    },
    {
      type: ResourceType.GRANT_ACCESS,
      description: 'Permite conceder permissões a outros usuários'
    },
    {
      type: ResourceType.UPDATE_ACCESS_EXPIRATION,
      description: 'Atualiza o tempo de expiração de permissões dos usuários'
    },
    {
      type: ResourceType.CREATE_USER,
      description: 'Permite criar novos usuários'
    },
    {
      type: ResourceType.UPDATE_USER,
      description: 'Permite atualizar os dados de usuários existentes'
    },
    {
      type: ResourceType.GET_USERS,
      description: 'Permite recuperar os usuários existentes'
    },
    {
      type: ResourceType.CHANGE_USER_ACTIVATION,
      description: 'Pode ativar/desativar usuários existentes'
    },
  ];

  for (const res of resources) {
    await Resource.findOrCreate({
      where: { type: res.type },
      defaults: res,
    });
  }
}