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

export interface IAuthService {
  registerUser(user: CreateUserSchema): Promise<UserWithoutPasswordSchema>;
  login(email: string, password: string): Promise<AccessTokenSchema>;
  changeUserActivation(userId: string, isActive: boolean): Promise<UserWithoutPasswordSchema>;
  getUsers(page: number, pageSize: number): Promise<IPage<UserWithoutPasswordSchema>>;
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

  const payload = {
    iss: process.env.JWT_ISSUER_CLAIM,
    sub: user.dataValues.id,
    jti: randomUUID(),
    role: user.dataValues.role
  };

  const expiresIn: ms.StringValue = (process.env.JWT_EXPIRATION_TIME || '1h') as ms.StringValue;
  const secret = String(process.env.JWT_SECRET)

  logger.info({ email }, 'Gerando token de acesso para o usuário');
  const token = jwt.sign(payload, secret, { expiresIn });

  return accessTokenSchema.parse({
    token,
    expiresAt: new Date(Date.now() + ms(expiresIn))
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

  const parsedUsers = users.map(u => userWithoutPasswordSchema.parse(u.dataValues));
  return paginate(parsedUsers, page, pageSize, count);
}

export const authService: IAuthService = {
  registerUser,
  login,
  changeUserActivation,
  getUsers
}