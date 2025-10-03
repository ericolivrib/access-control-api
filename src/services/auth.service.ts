import { ConflictError } from "@/errors/ConflictError";
import { NotFoundError } from "@/errors/NotFoundError";
import { UnauthorizedError } from "@/errors/UnauthorizedError";
import User from "@/models/users.model";
import { accessTokenSchema, AccessTokenSchema } from "@/schemas/access-token.schema";
import { CreateUserSchema } from "@/schemas/create-user.schema";
import { userWithoutPasswordSchema, UserWithoutPasswordSchema } from "@/schemas/user-without-password.schema";
import logger from "@/utils/logger";
import { IPage, paginate } from "@/utils/pagination";
import { randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";
import ms from 'ms'
import { environment } from "@/schemas/env.schema";
import { getJwtExpiration } from "@/utils/get-jwt-expiration";
import { userWithAccesses } from "@/schemas/user-with-accesses";

export interface IAuthService {
  registerUser(user: CreateUserSchema): Promise<UserWithoutPasswordSchema>;
  login(email: string, password: string): Promise<AccessTokenSchema>;
  changeUserActivation(userId: string, isActive: boolean): Promise<UserWithoutPasswordSchema>;
  getUsers(page: number, pageSize: number): Promise<IPage<UserWithoutPasswordSchema>>;
  getUserById(userId: string): Promise<UserWithAccesses>;
}

async function registerUser(user: CreateUserSchema): Promise<UserWithoutPasswordSchema> {
  const userCount = await User.count({ where: { email: user.email } });

  if (userCount > 0) {
    logger.info({ email: user.email }, 'Tentativa de cadastro com e-mail já existente');
    throw new ConflictError('O e-mail informado já está em uso');
  }

  const createdUser = await User.create(user);
  return userWithoutPasswordSchema.parse(createdUser.dataValues);
}

async function login(email: string, password: string): Promise<AccessTokenSchema> {
  const user = await User.findByEmail(email);

  if (user === null) {
    logger.info({ email }, 'Tentativa de login com usuário inexistente');
    throw new UnauthorizedError('Credenciais inválidas');
  }

  const invalidPassword = !user.isPasswordValid(password);

  if (invalidPassword) {
    logger.info({ email }, 'Tentativa de login com senha inválida');
    throw new UnauthorizedError('Credenciais inválidas');
  }

  logger.info({ email }, 'Gerando token de acesso para o usuário');
  const accessToken = user.generateAccessToken();
  const expiresAt = getJwtExpiration(accessToken);

  return accessTokenSchema.parse({
    token: accessToken,
    expiresAt
  });
}

async function changeUserActivation(userId: string, active: boolean): Promise<UserWithoutPasswordSchema> {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] }
  });

  if (!user) {
    logger.info({ userId }, 'Tentativa de alteração de status de usuário inexistente');
    throw new NotFoundError('Usuário não encontrado');
  }

  if (user.dataValues.active === active) {
    logger.info({ userId, active }, 'Tentativa de alteração de status de usuário para o mesmo status');
    throw new ConflictError(`Não é possível ${active ? 'ativar' : 'desativar'} um usuário que já está ${active ? 'ativo' : 'inativo'}`);
  }

  await user.update({ active });
  return userWithoutPasswordSchema.parse(user.dataValues);
}

async function getUsers(page: number, pageSize: number): Promise<IPage<UserWithoutPasswordSchema>> {
  const offset = (page - 1) * pageSize;

  const { count, rows: users } = await User.findAndCountAll({
    attributes: ['id', 'name', 'email', 'role', 'active'],
    limit: pageSize,
    offset,
    order: [['name', 'ASC']]
  });

  const parsedUsers = userWithoutPasswordSchema.array().parse(users);
  return paginate(parsedUsers, page, pageSize, count);
}

async function getUserById(userId: string): Promise<UserWithAccesses> {
  const user = await User.findWithAccessesByPk(userId);

  if (user === null) {
    logger.info({ userId }, 'Tentativa de busca por usuário inexistente');
    throw new NotFoundError('Usuário não encontrado');
  }

  return userWithAccesses.parse(user.dataValues);
}

export const authService: IAuthService = {
  registerUser,
  login,
  changeUserActivation,
  getUsers,
  getUserById
}