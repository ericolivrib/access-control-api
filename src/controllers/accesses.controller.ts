import { Request, Response } from "express";

interface IAccessController {
  grantAccess(req: Request, res: Response): Promise<void>;
  getUserAccesses(req: Request, res: Response): Promise<void>;
  getAllAccesses(req: Request, res: Response): Promise<void>;
  changeAccessExpirationDate(req: Request, res: Response): Promise<void>;
  revokeAccess(req: Request, res: Response): Promise<void>;
}

async function grantAccess(req: Request, res: Response) { }

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