import { ConflictError } from "@/errors/ConflictError";
import { NotFoundError } from "@/errors/NotFoundError";
import User from "@/models/users.model";
import { CreateUserSchema } from "@/schemas/create-user.schema";
import { userWithoutPasswordSchema, UserWithoutPasswordSchema } from "@/schemas/user-without-password.schema";
import { resolve } from "path";
import { th } from "zod/v4/locales";

export interface IAuthService {
  registerUser(user: CreateUserSchema): Promise<UserWithoutPasswordSchema>;
  login(username: string, password: string): Promise<string>;
  changeUserActivation(userId: string, isActive: boolean): Promise<UserWithoutPasswordSchema>;
  getUsers(): Promise<UserWithoutPasswordSchema[]>;
}

async function registerUser(user: CreateUserSchema): Promise<UserWithoutPasswordSchema> {
  const userCount = await User.count({ where: { email: user.email } });

  if (userCount > 0) {
    throw new ConflictError('O e-mail informado já está em uso');
  }

  const createdUser = await User.create(user);
  return userWithoutPasswordSchema.parse(createdUser.dataValues);
}

async function changeUserActivation(userId: string, active: boolean): Promise<UserWithoutPasswordSchema> {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] }
  });

  if (!user) {
    throw new NotFoundError('Usuário não encontrado');
  }

  if (user.dataValues.active === active) {
    throw new ConflictError(`Não é possível ${active ? 'ativar' : 'desativar'} um usuário que já está ${active ? 'ativo' : 'inativo'}`);
  }

  await user.update({ active });
  return userWithoutPasswordSchema.parse(user.dataValues);
}

async function getUsers(): Promise<UserWithoutPasswordSchema[]> {
  const users = await User.findAll({ attributes: ['id', 'name', 'email', 'role', 'active'] });
  return users.map(u => userWithoutPasswordSchema.parse(u.dataValues));
}

export const authService: IAuthService = {
  registerUser,
  login: function (username: string, password: string): Promise<string> {
    throw new Error("Function not implemented.");
  },
  changeUserActivation,
  getUsers
}