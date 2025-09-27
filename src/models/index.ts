import logger from "@/utils/logger";
import Access from "./accesses.model";
import Resource from "./resources.model";
import User from "./users.model";

export async function syncModels() {
  logger.info('Sincronizando models...')

  await Promise.allSettled([
    User.sync(),
    Resource.sync(),
    Access.sync(),
  ])
}