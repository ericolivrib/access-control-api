import { ACCESS_STATUSES } from "@/models/accesses.model";
import { PERMISSION_TYPES } from "@/models/permissions.model";
import z from "zod";

export const accessSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  permissionType: z.enum(PERMISSION_TYPES),
  status: z.enum(ACCESS_STATUSES),
  expiresAt: z.date(),
  grantedAt: z.date()
});

export type AccessSchema = z.infer<typeof accessSchema>;