import { ApiResponseSchema } from "@/schemas/api-response.schema";
import { ChangeUserActivationSchema } from "@/schemas/change-user-activation.schema";
import { CreateUserSchema } from "@/schemas/create-user.schema";
import { LoginSchema } from "@/schemas/login.schema";
import { authService } from "@/services/auth.service";
import { Request, Response } from "express";

export interface IAuthController {
  registerUser(req: Request, res: Response): Promise<void>;
  login(req: Request, res: Response): Promise<void>;
  changeUserActivation(req: Request, res: Response): Promise<void>;
  getUsers(req: Request, res: Response): Promise<void>;
}

async function registerUser(req: Request, res: Response) {
  const userData: CreateUserSchema = req.body;

  const createdUser = await authService.registerUser(userData);

  const responseBody: ApiResponseSchema = {
    message: 'Usuário registrado com sucesso',
    data: createdUser
  };

  res.status(201)
    .location(`/v1/users/${createdUser.id}`)
    .json(responseBody);
}

async function login(req: Request, res: Response) {
  const { email, password }: LoginSchema = req.body;

  const accessToken = await authService.login(email, password);

  const responseBody: ApiResponseSchema = {
    message: 'Login realizado com sucesso',
    data: accessToken
  };

  res.status(200).json(responseBody);
}

async function changeUserActivation(req: Request, res: Response) {
  const userId = req.params.id;
  const { active }: ChangeUserActivationSchema = req.body;

  const updatedUser = await authService.changeUserActivation(userId, active);

  const responseBody: ApiResponseSchema = {
    message: `Usuário ${active ? 'ativado' : 'desativado'} com sucesso`,
    data: updatedUser
  };

  res.status(200).json(responseBody);
}

async function getUsers(req: Request, res: Response) {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;

  const usersPage = await authService.getUsers(page, pageSize);

  const responseBody: ApiResponseSchema = {
    message: usersPage.totalItems > 0
      ? 'Página de usuários recuperada com sucesso'
      : 'Não há usuários cadastrados',
    data: usersPage
  };

  res.status(200).json(responseBody);
}

export const authController: IAuthController = {
  registerUser,
  login,
  changeUserActivation,
  getUsers
};