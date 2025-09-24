import bcrypt from "bcryptjs";
import User from "../models/users.model";
import logger from "@/utils/logger";

export async function seedAdminUser() {
  const passwordEnv = String(process.env.SEEDER_ADMIN_PASSWORD);

  logger.info("Configurando usuário administrador...");

  await User.findOrCreate({
    where: { email: "admin@test.com" },
    defaults: {
      name: "Admin",
      email: "admin@test.com",
      password: passwordEnv,
      role: "admin",
      active: true,
    },
  });
}