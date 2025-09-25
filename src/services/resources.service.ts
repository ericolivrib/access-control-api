import { InternalServerError } from "@/errors/InternalServerError";
import Resource from "@/models/resources.model";
import { resourceSchema, ResourceSchema } from "@/schemas/resource.schema";
import logger from "@/utils/logger";

interface ResourcesService {
  getResources(): Promise<ResourceSchema[]>;
}

async function getResources(): Promise<ResourceSchema[]> {
  const resources = await Resource.findAll();

  if (resources.length === 0) {
    logger.error('Nenhum recurso encontrado na base de dados.');
    throw new InternalServerError('Nenhum recurso encontrado na base de dados.');
  }

  return resourceSchema.array().parse(resources);
}

export const resourcesService: ResourcesService = {
  getResources
};