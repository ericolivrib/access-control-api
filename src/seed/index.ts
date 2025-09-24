import { ca } from "zod/v4/locales";
import { seedAdminUser } from "./admin.seeder";
import logger from "@/utils/logger";

async function runSeeders() {
  try {
    await seedAdminUser();
    logger.info("Finalizando execução dos seeders.");
    process.exit(0);
  } catch (error) {
    logger.error(error, "Erro ao executar seeders:");
    process.exit(1);
  }
}

(async() => await runSeeders())();