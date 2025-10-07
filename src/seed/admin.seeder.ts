import UserModel from "../models/user.model";
import logger from "@/utils/logger";
import { environment } from "@/schemas/env.schema";

export async function seedAdminUser() {
  const email = environment.SEEDER_ADMIN_EMAIL!;
  const password = environment.SEEDER_ADMIN_PASSWORD!;

  logger.info("Configurando usuário administrador...");

  await UserModel.findOrCreate({
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