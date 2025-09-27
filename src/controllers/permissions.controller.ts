import { Request, Response } from "express";
import { permissionsService } from "@/services/permissions.service";

interface IPermissionController {
  getPermissions(req: Request, res: Response): Promise<void>;
}

async function getPermissions(req: Request, res: Response) {
  const permissions = await permissionsService.getPermissions();
  res.status(200).json(permissions);
}

export const permissionController: IPermissionController = {
  getPermissions,
};