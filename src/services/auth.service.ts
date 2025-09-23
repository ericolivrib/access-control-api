import { ConflictError } from "@/errors/ConflictError";
import User from "@/models/users.model";
import { CreateUserSchema } from "@/schemas/create-user.schema";
import { userWithoutPasswordSchema, UserWithoutPasswordSchema } from "@/schemas/user-without-password.schema";
import { resolve } from "path";

export interface IAuthService {
  registerUser(user: CreateUserSchema): Promise<UserWithoutPasswordSchema>;
  login(username: string, password: string): Promise<string>;
  changeUserActivation(userId: string, isActive: boolean): Promise<void>;
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

async function getUsers(): Promise<UserWithoutPasswordSchema[]> {
  const users = await User.findAll({ attributes: ['id', 'name', 'email', 'role', 'active'] });
  return users.map(u => userWithoutPasswordSchema.parse(u.dataValues));
}

export const authService: IAuthService = {
  registerUser,
  login: function (username: string, password: string): Promise<string> {
    throw new Error("Function not implemented.");
  },
  changeUserActivation: function (userId: string, isActive: boolean): Promise<void> {
    throw new Error("Function not implemented.");
  },
  getUsers
}