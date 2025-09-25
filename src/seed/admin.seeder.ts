import User from "../models/users.model";
import logger from "@/utils/logger";
import { environment } from "@/schemas/env.schema";

export async function seedAdminUser() {
  const email = environment.SEEDER_ADMIN_EMAIL!;
  const password = environment.SEEDER_ADMIN_PASSWORD!;

  logger.info("Configurando usuário administrador...");

  await User.findOrCreate({
    where: { email },
    defaults: {
      name: "Admin",
      email,
      password,
      role: "admin",
      active: true,
    },
  });
}