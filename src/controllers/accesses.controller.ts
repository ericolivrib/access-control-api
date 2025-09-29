import { AccessSchema } from "@/schemas/access.schema";
import { ApiResponseSchema } from "@/schemas/api-response.schema";
import { GrantAccessSchema } from "@/schemas/grant-access.schema";
import { accessService } from "@/services/access.service";
import { Request, Response } from "express";

interface IAccessController {
  grantAccess(req: Request, res: Response): Promise<void>;
  getUserAccesses(req: Request, res: Response): Promise<void>;
  getAllAccesses(req: Request, res: Response): Promise<void>;
  changeAccessExpirationDate(req: Request, res: Response): Promise<void>;
  revokeAccess(req: Request, res: Response): Promise<void>;
}

async function grantAccess(req: Request, res: Response) {
  const requestBody: GrantAccessSchema = req.body;
  const { userId } = req.params

  const grantedAccess = await accessService.grantAccess(userId, requestBody);

  const responseBody: ApiResponseSchema = {
    message: 'Acesso concedido com sucesso',
    data: grantedAccess
  }

  res.status(201)
    .location(`/v1/accesses/${grantedAccess.id}`)
    .json(responseBody);
}

async function getUserAccesses(req: Request, res: Response) { }

async function getAllAccesses(req: Request, res: Response) { }

async function changeAccessExpirationDate(req: Request, res: Response) { }

async function revokeAccess(req: Request, res: Response) { }

export const accessController: IAccessController = {
  grantAccess,
  getUserAccesses,
  getAllAccesses,
  changeAccessExpirationDate,
  revokeAccess,
};