import Resource, { ResourceType } from "@/models/resources.model";
import logger from "@/utils/logger";

export async function seedResources() {
  logger.info("Configurando recursos padrão...");

  const resources = [
    {
      type: ResourceType.REVOKE_ACCESS,
      description: 'Revoga os acessos de recursos de usuários'
    },
    {
      type: ResourceType.GRANT_ACCESS,
      description: 'Concede os acessos de recursos a outros usuários'
    },
    {
      type: ResourceType.CREATE_USER,
      description: 'Pode criar novos usuários'
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