import { PERMISSION_TYPES } from "@/models/permissions.model";
import z from "zod";

export const grantAccessSchema = z.object({
  permissionType: z.enum(PERMISSION_TYPES, 'Permissão não existente'),
  expiresAt: z.date().min(new Date(), 'Data de expiração não pode estar no passado')
});

export type GrantAccessSchema = z.infer<typeof grantAccessSchema>;