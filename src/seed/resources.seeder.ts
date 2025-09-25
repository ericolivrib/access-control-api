import Resource from "@/models/resources.model";
import logger from "@/utils/logger";

export async function seedResources() {
  logger.info("Configurando recursos padrão...");

  const resources = [
    {
      label: 'access_management',
      description: 'Concede e/ou revoga os acessos de recursos a outros usuários'
    },
    {
      label: 'user_management',
      description: 'Pode criar novos usuários e ativar/desativar usuários existentes'
    },
  ];

  for (const res of resources) {
    await Resource.findOrCreate({
      where: { label: res.label },
      defaults: res,
    });
  }
}