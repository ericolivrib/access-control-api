import { CreateUserSchema } from "@/schemas/create-user.schema";
import { Request, Response } from "express";

export interface IAuthController {
  registerUser(req: Request, res: Response): Promise<void>;
  login(req: Request, res: Response): Promise<void>;
  changeUserActivation(req: Request, res: Response): Promise<void>;
  getUsers(req: Request, res: Response): Promise<void>;
}

async function registerUser(req: Request, res: Response) {
  const userData: CreateUserSchema = req.body;
}

async function login(req: Request, res: Response) { }

async function changeUserActivation(req: Request, res: Response) { }

async function getUsers(req: Request, res: Response) { }

export const AuthController: IAuthController = {
  registerUser,
  login,
  changeUserActivation,
  getUsers
};