import { ApiResponseSchema } from "@/schemas/api-response.schema";
import { CreateUserSchema } from "@/schemas/create-user.schema";
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

  res.status(201).json(responseBody);
}

async function login(req: Request, res: Response) { }

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
  const users = await authService.getUsers();

  const responseBody: ApiResponseSchema = {
    message: 'Lista de usuários recuperada com sucesso',
    data: users
  };

  res.status(200).json(responseBody);
}

export const authController: IAuthController = {
  registerUser,
  login,
  changeUserActivation,
  getUsers
};