import { Request, Response } from "express";
import { resourcesService } from "@/services/resources.service";

interface IResourceController {
  getResources(req: Request, res: Response): Promise<void>;
}

async function getResources(req: Request, res: Response) {
  const resources = await resourcesService.getResources();
  res.status(200).json(resources);
}

export const resourceController: IResourceController = {
  getResources,
};