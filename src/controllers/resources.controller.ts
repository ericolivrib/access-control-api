import { Request, Response } from "express";

interface IResourceController {
  getResources(req: Request, res: Response): Promise<void>;
}

async function getResources(req: Request, res: Response) { }

export const ResourceController: IResourceController = {
  getResources,
};