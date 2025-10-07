import { PERMISSION_TYPES } from "@/models/permission.model";
import z from "zod";

export const grantAccessSchema = z.object({
  permissionType: z.enum(PERMISSION_TYPES, 'Permissão não existente'),
  expiresAt: z.coerce.date().min(new Date(), 'Data de expiração não pode estar no passado')
});

export type GrantAccessSchema = z.infer<typeof grantAccessSchema>;