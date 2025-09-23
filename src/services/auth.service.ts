import { ConflictError } from "@/errors/ConflictError";
import User from "@/models/users.model";
import { CreateUserSchema } from "@/schemas/create-user.schema";
import { userWithoutPasswordSchema, UserWithoutPasswordSchema } from "@/schemas/user-without-password.schema";

export interface IAuthService {
  registerUser(user: CreateUserSchema): Promise<UserWithoutPasswordSchema>;
  login(username: string, password: string): Promise<string>;
  changeUserActivation(userId: string, isActive: boolean): Promise<void>;
  getUsers(): Promise<Array<{ id: string; username: string; isActive: boolean }>>;
}

async function registerUser(user: CreateUserSchema): Promise<UserWithoutPasswordSchema> {
  const userCount = await User.count({ where: { email: user.email } });
  
  if (userCount > 0) {
    throw new ConflictError('O e-mail informado já está em uso');
  }

  const createdUser = await User.create(user);
  console.table(createdUser);
  return userWithoutPasswordSchema.parse(createdUser.dataValues);
}

export const authService: IAuthService = {
  registerUser,
  login: function (username: string, password: string): Promise<string> {
    throw new Error("Function not implemented.");
  },
  changeUserActivation: function (userId: string, isActive: boolean): Promise<void> {
    throw new Error("Function not implemented.");
  },
  getUsers: function (): Promise<Array<{ id: string; username: string; isActive: boolean; }>> {
    throw new Error("Function not implemented.");
  }
}